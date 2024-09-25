package get

import (
    "net/http"

    "example.com/sa-67-example/config"
    "github.com/gin-gonic/gin"
)

func CountRowMenu(c *gin.Context) {
    var count int64

    // ดึง database connection จาก config
    db := config.DB()

    // นับจำนวนแถวในตาราง menus
    if err := db.Table("menus").Count(&count).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to count rows: " + err.Error()})
        return
    }

    // ส่งจำนวนแถวกลับในรูปแบบ JSON
    c.JSON(http.StatusOK, gin.H{"data": count})
}

func CountRowIngredient(c *gin.Context) {
	var count int64
	db := config.DB()

	if err := db.Table("ingredients").Count(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": count})
}

func CountRowMember(c *gin.Context) {
	var count int64
	db := config.DB()

	if err := db.Table("members").Count(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": count})
}

func CountRowEmp(c *gin.Context) {
	var count int64
	db := config.DB()
	if err := db.Table("employees").Count(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": count})
}

func CountRowPromotion(c *gin.Context) {
	var count int64
	db := config.DB()

	if err := db.Table("promotions").Count(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": count})
}

func CountRowOrder(c *gin.Context) {
	var count int64
	db := config.DB()

	if err := db.Table("orders").Count(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": count})
}