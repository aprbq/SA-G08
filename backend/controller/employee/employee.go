package employee

import (
	"log"
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// GetAll retrieves all users along with their associated gender
func GetAll(c *gin.Context) {
    var employee []entity.Employee
    db := config.DB()
    results := db.Preload("Gender").Preload("Role").Find(&employee)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, employee)
}

// Get retrieves a single user by ID along with their associated gender
func Get(c *gin.Context) {
    ID := c.Param("id")
    log.Println("Received ID:", ID)
    
    var employee entity.Employee
    db := config.DB()
    results := db.Preload("Gender").Preload("Role").First(&employee, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if employee.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, employee)
}

// Update updates the details of an existing user
func Update(c *gin.Context) {
    var employee entity.Employee
    EmployeeID := c.Param("id")
    db := config.DB()

    result := db.First(&employee, EmployeeID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&employee); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&employee)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// Delete removes a user by ID
func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    if tx := db.Exec("DELETE FROM employees WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
