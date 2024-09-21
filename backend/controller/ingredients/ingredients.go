package ingredients

import (
	"net/http"

	"example.com/sa-67-example/config"
	//"example.com/sa-67-example/controller/supplier"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// GetAll retrieves all ingredient along with their associated class
func GetAll(c *gin.Context) {
	var ingredients []entity.Ingredients

	db := config.DB()

	results := db.Preload("Class").Preload("Unit").Preload("Suppliers").Find(&ingredients)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	

	c.JSON(http.StatusOK, ingredients)
}

// Get retrieves a single ingredient by ID along with their associated class
func Get(c *gin.Context) {
	ID := c.Param("id")

	var ingredients entity.Ingredients

	db := config.DB()
	results := db.Preload("Class").First(&ingredients, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if ingredients.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, ingredients)
}

// Update updates the details of an existing ingredient
func Update(c *gin.Context) {
	var ingredient entity.Ingredients

	IngredientID := c.Param("id")

	db := config.DB()
	result := db.First(&ingredient, IngredientID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&ingredient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&ingredient)
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

	if tx := db.Exec("DELETE FROM ingredients WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

func CreateIngredient(c *gin.Context) {
    var ingredient entity.Ingredients
    // bind JSON เข้าตัวแปร ingredient
    if err := c.ShouldBindJSON(&ingredient); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // ค้นหา class ด้วย id
    var class entity.Class
    if db.First(&class, ingredient.ClassID).RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "class not found"})
        return
    }

    // ค้นหา unit ด้วย id
    var unit entity.Unit
    if db.First(&unit, ingredient.UnitID).RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "unit not found"})
        return
    }

    // ค้นหา suppliers ด้วย id
    var suppliers entity.Suppliers
    if db.First(&suppliers, ingredient.SuppliersID).RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "supplier not found"}) // แก้ไขข้อความ
        return
    }

    // ค้นหา employee ด้วย id
    var employee entity.Employee
    if db.First(&employee, ingredient.EmployeeID).RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
        return
    }

    // สร้าง Ingredient ใหม่
    i := entity.Ingredients{
        Name:       ingredient.Name,
        Quantity:   ingredient.Quantity,
        UnitPrice:  ingredient.UnitPrice,
        Price:      ingredient.Price,
        ExpDate:    ingredient.ExpDate,
        ClassID:    ingredient.ClassID,
        Class:      class,
        EmployeeID: ingredient.EmployeeID,
        Employees:  employee,
        SuppliersID: ingredient.SuppliersID,
        Suppliers:  suppliers,
        UnitID:     ingredient.UnitID,
        Unit:       unit,
    }

    // บันทึกในฐานข้อมูล
    if err := db.Create(&i).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": i})
}
