package unit

import (
	"github.com/gin-gonic/gin"
	"example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
	"gorm.io/gorm"
	"net/http"
)

func CreateUnit(c *gin.Context) {
	db := config.DB()
	var unit entity.Unit
	if err := c.ShouldBindJSON(&unit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := db.Create(&unit)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, unit)
}

func GetUnits(c *gin.Context) {
	db := config.DB()
	var unit []entity.Unit
	result := db.Find(&unit)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, unit)
}
func GetAll(c *gin.Context) {
    db := config.DB()
    var class []entity.Class
    db.Find(&class)

    c.JSON(http.StatusOK, &class)
}
func GetUnit(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var unit entity.Unit
	result := db.First(&unit, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Unit not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, unit)
}

func UpdateUnit(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var unit entity.Unit
	if err := c.ShouldBindJSON(&unit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var existingUnit entity.Unit
	result := db.First(&existingUnit, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Unit not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}
	db.Model(&existingUnit).Updates(unit)
	c.JSON(http.StatusOK, existingUnit)
}

func DeleteUnit(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var unit entity.Unit
	result := db.Delete(&unit, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Unit not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Unit deleted successfully"})
}