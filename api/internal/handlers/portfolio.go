package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type CryptoData struct {
	Price            float64 `json:"price"`
	PercentChange1H  float64 `json:"percent_change_1h"`
	PercentChange24H float64 `json:"percent_change_24h"`
	PercentChange7D  float64 `json:"percent_change_7d"`
}

func FetchPortfolio(c *gin.Context) {
	// Verify API key is loaded
	apiKey := os.Getenv("CMC_API_KEY")
	fmt.Printf("API Key loaded: %v\n", apiKey != "")

	if apiKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API key not found"})
		return
	}

	// Get tickers from query parameter
	ids := c.Query("ids")
	if ids == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No tickers provided"})
		return
	}

	// Convert to uppercase and create URL
	symbols := strings.ToUpper(ids)
	url := fmt.Sprintf("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=%s&convert=USD", symbols)

	// Make request
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Request creation failed: %v", err)})
		return
	}

	// Add headers
	req.Header.Set("X-CMC_PRO_API_KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("API request failed: %v", err)})
		return
	}
	defer resp.Body.Close()

	// Read and log response
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Printf("Response Status: %d\n", resp.StatusCode)
	fmt.Printf("Response Body: %s\n", string(body))

	// Create clean response map
	cleanResponse := make(map[string]CryptoData)

	// Parse the CMC response
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to parse response: %v", err)})
		return
	}

	// Extract data safely
	if data, ok := result["data"].(map[string]interface{}); ok {
		for symbol, cryptoData := range data {
			if cryptoInfo, ok := cryptoData.(map[string]interface{}); ok {
				if quote, ok := cryptoInfo["quote"].(map[string]interface{}); ok {
					if usd, ok := quote["USD"].(map[string]interface{}); ok {
						cleanResponse[symbol] = CryptoData{
							Price:            usd["price"].(float64),
							PercentChange1H:  usd["percent_change_1h"].(float64),
							PercentChange24H: usd["percent_change_24h"].(float64),
							PercentChange7D:  usd["percent_change_7d"].(float64),
						}
					}
				}
			}
		}
	}

	c.JSON(http.StatusOK, cleanResponse)
}
