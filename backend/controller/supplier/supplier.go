package supplier

import (
	"github.com/gin-gonic/gin"
	"example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
	"gorm.io/gorm"
	"net/http"
)

func CreateSupplier(c *gin.Context) {
	db := config.DB()
	var supplier entity.Suppliers
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := db.Create(&supplier)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, supplier)
}

func GetSuppliers(c *gin.Context) {
	db := config.DB()
	var suppliers []entity.Suppliers
	result := db.Preload("Ingredient").Find(&suppliers) // Preload ingredients
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, suppliers)
}

func GetSupplier(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var supplier entity.Suppliers
	result := db.Preload("Ingredient").First(&supplier, id) // Preload ingredients
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, supplier)
}

func UpdateSupplier(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var supplier entity.Suppliers
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var existingSupplier entity.Suppliers
	result := db.First(&existingSupplier, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}
	db.Model(&existingSupplier).Updates(supplier)
	c.JSON(http.StatusOK, existingSupplier)
}

func DeleteSupplier(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var supplier entity.Suppliers
	result := db.Delete(&supplier, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted successfully"})
}