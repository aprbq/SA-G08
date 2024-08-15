package menus

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)

// GetAll retrieves all menu along with their associated class
func GetAll(c *gin.Context) {
    var menus []entity.Menu
    db := config.DB()
    results := db.Preload("Class").Find(&menus)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, menus)
}

// Get retrieves a single menu by ID along with their associated class
func Get(c *gin.Context) {
    ID := c.Param("id")
    var menu entity.Menu
    db := config.DB()
    results := db.Preload("Class").First(&menu, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if menu.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, menu)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var menu entity.Menu
    menuID := c.Param("id")
    db := config.DB()

    result := db.First(&menu, menuID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&menu); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&menu)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// Delete removes a menu by ID
func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    if tx := db.Exec("DELETE FROM menus WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
