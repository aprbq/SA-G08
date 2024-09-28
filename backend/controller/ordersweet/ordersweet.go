package ordersweet

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// GetAll retrieves all Ordersweets
func GetAll(c *gin.Context) {
	var ordersweet []entity.Ordersweet
	db := config.DB()

	// ค้นหาข้อมูล Ordersweet
	if err := db.Find(&ordersweet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve ordersweets"})
		return
	}

	c.JSON(http.StatusOK, ordersweet)
}
