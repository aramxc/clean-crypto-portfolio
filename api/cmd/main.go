package main

import (
	"github.com/aramxc/clean-crypto-portfolio/internal/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	// Create a default gin router
	r := gin.Default()

	// Set up CORS if needed
	// r.Use(cors.Default())

	// Register the FetchPortfolio handler
	r.POST("/portfolio", handlers.FetchPortfolio)

	// Register the FetchTickerList handler
	r.GET("/ticker-list", handlers.FetchTickerList)

	// Run the server on port 8080
	r.Run(":8080")
}
