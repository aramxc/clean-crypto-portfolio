package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=USD"
)

type PortfolioRequest struct {
	Tickers []string `json:"tickers"`
}

type CMCResponse struct {
	Data []struct {
		Symbol string `json:"symbol"`
		Quote  struct {
			USD struct {
				Price            float64 `json:"price"`
				PercentChange1H  float64 `json:"percent_change_1h"`
				PercentChange24H float64 `json:"percent_change_24h"`
				PercentChange7D  float64 `json:"percent_change_7d"`
			} `json:"USD"`
		} `json:"quote"`
	} `json:"data"`
}

func FetchPortfolio(c *gin.Context) {
	var req PortfolioRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	apiKey := os.Getenv("CMC_API_KEY")
	if apiKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API key not found"})
		return
	}

	// Make request to CoinMarketCap API
	client := &http.Client{}
	request, err := http.NewRequest("GET", BASE_URL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}
	request.Header.Set("X-CMC_PRO_API_KEY", apiKey)

	response, err := client.Do(request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data from API"})
		return
	}
	defer response.Body.Close()

	// Parse API response
	body, _ := ioutil.ReadAll(response.Body)
	var cmcResponse CMCResponse
	if err := json.Unmarshal(body, &cmcResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse API response"})
		return
	}

	// Extract relevant data for requested tickers
	portfolioData := make(map[string]interface{})
	for _, ticker := range req.Tickers {
		for _, currency := range cmcResponse.Data {
			if strings.EqualFold(currency.Symbol, ticker) {
				portfolioData[ticker] = currency.Quote.USD
				break
			}
		}
	}

	c.JSON(http.StatusOK, portfolioData)
}
