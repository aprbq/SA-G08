package menuingredient

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)

func CreateMenuIngredient(c *gin.Context) {
    var menuIngredientData struct {
        MenuID       uint `json:"menu_id"`
        Ingredients  []struct {
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
            MenuID:       menuIngredientData.MenuID,
            IngredientsID: ingredientData.IngredientID,
            Quantity:     ingredientData.Quantity, // บันทึก quantity ด้วย
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
    ID := c.Param("id")
    var menuingredient entity.MenuIngredient
    db := config.DB()
    results := db.Preload("Menu").Preload("Ingredients").First(&menuingredient, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if menuingredient.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, menuingredient)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var menuingredient entity.MenuIngredient
    MenuIngredientID := c.Param("id")
    db := config.DB()

    result := db.First(&menuingredient, MenuIngredientID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&menuingredient); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&menuingredient)
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

    if tx := db.Exec("DELETE FROM menuingredient WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
