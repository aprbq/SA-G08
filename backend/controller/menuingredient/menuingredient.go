package menuingredient

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreateMenuIngredient(c *gin.Context) {
	var menuIngredientData struct {
		MenuID      uint `json:"menu_id"`
		Ingredients []struct {
			IngredientID uint `json:"ingredient_id"`
			Quantity     uint `json:"quantity"`
		} `json:"ingredients"` // ใช้ struct เพื่อรองรับ IngredientID และ Quantity
	}

	// ผูกข้อมูลจาก JSON ที่ส่งเข้ามา
	if err := c.ShouldBindJSON(&menuIngredientData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่าเมนูที่ระบุมีอยู่หรือไม่
	var menu entity.Menu
	db.First(&menu, menuIngredientData.MenuID)
	if menu.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "menu not found"})
		return
	}

	// ตรวจสอบและบันทึกส่วนประกอบ (ingredient) แต่ละรายการพร้อมกับ quantity
	for _, ingredientData := range menuIngredientData.Ingredients {
		var ingredient entity.Ingredients
		db.First(&ingredient, ingredientData.IngredientID)
		if ingredient.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "ingredient not found"})
			return
		}

		// สร้าง MenuIngredient พร้อมกับ quantity
		menuIngredient := entity.MenuIngredient{
			MenuID:        menuIngredientData.MenuID,
			IngredientsID: ingredientData.IngredientID,
			Quantity:      ingredientData.Quantity, // บันทึก quantity ด้วย
		}

		// บันทึกลงในฐานข้อมูล
		if err := db.Create(&menuIngredient).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "MenuIngredient created successfully"})
}

// GetAll retrieves all menu along with their associated class
func GetAll(c *gin.Context) {
	var menuingredient []entity.MenuIngredient
	db := config.DB()
	results := db.Preload("Menu").Preload("Ingredients").Find(&menuingredient)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, menuingredient)
}

// Get retrieves a single menu by ID along with their associated class
func Get(c *gin.Context) {
	menuID := c.Param("id")

	var ingredients []entity.MenuIngredient
	db := config.DB()
	results := db.Preload("Menu").Preload("Ingredients").Where("menu_id = ?", menuID).Find(&ingredients)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if len(ingredients) == 0 {
		c.JSON(http.StatusNoContent, nil) // No content found
		return
	}

	// Format the response to include ingredients information
	var response []map[string]interface{}
	for _, ingredient := range ingredients {
		response = append(response, map[string]interface{}{
			"ingredients_id": ingredient.IngredientsID,
			"quantity":       ingredient.Quantity,
			"name":           ingredient.Ingredients.Name, // Assuming Ingredient has a Name field
			"unit_id":        ingredient.Ingredients.UnitID,
		})
	}

	c.JSON(http.StatusOK, response)
}

// Update updates the details of an existing menu's ingredients
func Update(c *gin.Context) {
	var menuIngredientData struct {
		MenuID      uint `json:"menu_id"`
		Ingredients []struct {
			IngredientID uint `json:"ingredients_id"`
			Quantity     uint `json:"quantity"`
		} `json:"ingredients"`
	}

	// Bind the incoming JSON payload to the struct
	if err := c.ShouldBindJSON(&menuIngredientData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// Check if the menu exists
	var menu entity.Menu
	db.First(&menu, menuIngredientData.MenuID)
	if menu.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	// Get the current ingredients for this menu
	var currentMenuIngredients []entity.MenuIngredient
	db.Where("menu_id = ?", menuIngredientData.MenuID).Find(&currentMenuIngredients)

	// Create a map to track the new ingredients from the request
	newIngredientsMap := make(map[uint]uint)
	for _, ingredientData := range menuIngredientData.Ingredients {
		newIngredientsMap[ingredientData.IngredientID] = ingredientData.Quantity
	}

	// Update or add new ingredients
	for _, ingredientData := range menuIngredientData.Ingredients {
		var menuIngredient entity.MenuIngredient

		// Check if the ingredient already exists for this menu
		result := db.Where("menu_id = ? AND ingredients_id = ?", menuIngredientData.MenuID, ingredientData.IngredientID).First(&menuIngredient)

		if result.RowsAffected > 0 {
			// If it exists, update the quantity
			menuIngredient.Quantity = ingredientData.Quantity
			if err := db.Save(&menuIngredient).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ingredient"})
				return
			}
		} else {
			// If it doesn't exist, create a new MenuIngredient
			newMenuIngredient := entity.MenuIngredient{
				MenuID:        menuIngredientData.MenuID,
				IngredientsID: ingredientData.IngredientID,
				Quantity:      ingredientData.Quantity,
			}

			if err := db.Create(&newMenuIngredient).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}
	}

	// Remove ingredients that are no longer in the new update
	for _, currentIngredient := range currentMenuIngredients {
		if _, exists := newIngredientsMap[currentIngredient.IngredientsID]; !exists {
			if err := db.Delete(&entity.MenuIngredient{}, "menu_id = ? AND ingredients_id = ?", menuIngredientData.MenuID, currentIngredient.IngredientsID).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete ingredient"})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Menu ingredients updated successfully"})
}

// Delete removes a menu by ID
func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Exec("DELETE FROM menuingredient WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
