package ingredients

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// GetAll retrieves all ingredient along with their associated class
func GetAll(c *gin.Context) {
	var ingredients []entity.Ingredients

	db := config.DB()

	results := db.Preload("Class").Find(&ingredients)
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
	// bind เข้าตัวแปร ingredient
	if err := c.ShouldBindJSON(&ingredient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ค้นหา class ด้วย id
	var class entity.Class
	db.First(&class, ingredient.ClassID)
	if class.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "class not found"})
		return
	}

	var employee entity.Employee
	// bind เข้าตัวแปร user
	db.First(&employee, ingredient.Employees)
	if employee.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}

	// สร้าง User
	i := entity.Ingredients{
		Name:      ingredient.Name,     // ตั้งค่าฟิลด์ FirstName
		Quantity:  ingredient.Quantity, // ตั้งค่าฟิลด์ LastName
		Unit:      ingredient.Unit,     // ตั้งค่าฟิลด์ Email
		UnitPrice: ingredient.UnitPrice,
		Price:     ingredient.Price,
		Supplier:  ingredient.Supplier,
		ExpDate:   ingredient.ExpDate,

		ClassID: ingredient.ClassID, // โยงความสัมพันธ์กับ Entity Class
		Class:   class,

		EmployeeID: ingredient.EmployeeID, // โยงความสัมพันธ์กับ Entity User
		Employees:  employee,
	}

	// บันทึก
	if err := db.Create(&i).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": i})
}
