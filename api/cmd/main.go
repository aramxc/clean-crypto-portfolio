package main

import (
	"github.com/gin-gonic/gin"
	"github.com/yourusername/clean-crypto-portfolio/internal/handlers"
)

func main() {
	r := gin.Default()
	r.GET("/api/ticker-list", handlers.GetTickerList)
	r.Run(":8080")
}
