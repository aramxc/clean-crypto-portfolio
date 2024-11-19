package main

import (
	"time"

	"github.com/aramxc/clean-crypto-portfolio/api/internal/handlers"
	"github.com/gin-contrib/timeout"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

func main() {
	router := gin.Default()

	// Create a rate limiter: 100 requests per minute with burst of 5
	limiter := rate.NewLimiter(rate.Every(time.Minute/100), 5)

	// Add rate limiting middleware
	router.Use(func(c *gin.Context) {
		if !limiter.Allow() {
			c.JSON(429, gin.H{"error": "Too many requests"})
			c.Abort()
			return
		}
		c.Next()
	})

	// Add timeout middleware (5 seconds)
	router.Use(timeout.New(
		timeout.WithTimeout(5*time.Second),
		timeout.WithHandler(func(c *gin.Context) {
			c.Next()
		}),
	))

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Set up routes with error handling
	router.GET("/api/portfolio", handlers.FetchPortfolio)
	router.GET("/api/tickers", func(c *gin.Context) {
		handlers.GetTickerList(c.Writer, c.Request)
	})

	// Start the server with error handling
	if err := router.Run(":8080"); err != nil {
		panic(err)
	}
}
