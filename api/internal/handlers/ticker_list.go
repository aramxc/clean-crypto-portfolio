package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetTickerList(c *gin.Context) {
	// TODO: Implement ticker list logic
	c.JSON(http.StatusOK, gin.H{"message": "Ticker list endpoint"})
}