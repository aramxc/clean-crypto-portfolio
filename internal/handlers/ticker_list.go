package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func FetchTickerList(c *gin.Context) {
	// Load cached data or fetch from API
	cachedData, err := loadCachedData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	// Extract tickers from cached data
	var tickers []gin.H
	for index, currency := range cachedData.Data {
		tickers = append(tickers, gin.H{
			"label": currency.Symbol,
			"id":    index + 1,
		})
	}

	c.JSON(http.StatusOK, tickers)
}

func loadCachedData() (*CachedData, error) {
	// Implement the logic to load cached data
	// For now, return a placeholder
	return &CachedData{}, nil
}

type CachedData struct {
	Data []struct {
		Symbol string `json:"symbol"`
	} `json:"data"`
}
