package main

import (
	"github.com/aramxc/clean-crypto-portfolio/internal/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// API base URL for CoinGecko
	BASE_URL := "https://api.coingecko.com/api/v3"

	// Set up routes
	router.POST("/portfolio", handlers.FetchPortfolio(BASE_URL))
	router.GET("/ticker-list", handlers.FetchTickerList(BASE_URL))

	// Start the server on port 8080
	router.Run(":8080")
}
