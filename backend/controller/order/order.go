package order

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)

// GetAll retrieves all ingredient along with their associated class
func GetAll(c *gin.Context) {
    var order []entity.Order
    db := config.DB()
    results := db.Preload("Class").Find(&order)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, order)
}

// Get retrieves a single ingredient by ID along with their associated class
func Get(c *gin.Context) {
    ID := c.Param("id")
    var order entity.Order
    db := config.DB()
    results := db.Preload("Class").First(&order, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if order.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, order)
}

// Update updates the details of an existing ingredient
func Update(c *gin.Context) {
    var order entity.Order
    OrderID := c.Param("id")
    db := config.DB()

    result := db.First(&order, OrderID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&order); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&order)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// Delete removes a ingredient by ID
func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    if tx := db.Exec("DELETE FROM order WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
