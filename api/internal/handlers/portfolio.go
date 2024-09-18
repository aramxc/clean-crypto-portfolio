package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetPortfolio(c *gin.Context) {
	// TODO: Implement portfolio logic
	c.JSON(http.StatusOK, gin.H{"message": "Portfolio endpoint"})
}