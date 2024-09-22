package condition

import (
    "net/http"


    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "fmt"

)



func CreateCondition(c *gin.Context) {
    var conditionData struct {
		PromotionID uint   `json:"promotion_id"`
		MenuIDs     []uint `json:"menu_ids"` // ใช้เป็น array ของ uint
	}

	if err := c.ShouldBindJSON(&conditionData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	db := config.DB()

	// ค้นหาโปรโมชั่น
	var promotion entity.Promotion
	db.First(&promotion, conditionData.PromotionID)
	if promotion.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "promotion not found"})
		return
	}

	// ค้นหาและบันทึกเงื่อนไขแต่ละรายการ
	for _, menuID := range conditionData.MenuIDs {
		var menu entity.Menu
		db.First(&menu, menuID)
		if menu.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "menu not found"})
			return
		}

		condition := entity.Condition{
			PromotionID: conditionData.PromotionID,
			MenuID:      menuID,
		}

		if err := db.Create(&condition).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success"})
}

// GetAll retrieves all promotion along with their associated class
func GetAll(c *gin.Context) {
var condition []entity.Condition
db := config.DB()
results := db.Preload("Menu").Preload("Promotion").Find(&condition)

if results.Error != nil {
    c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
    return
}
c.JSON(http.StatusOK, condition)
}

// Get retrieves a single promotion by ID along with their associated class
func Get(c *gin.Context) {
	promotionID := c.Param("id")

    var menus []entity.Condition
    db := config.DB()
    results := db.Preload("Promotion").Preload("Menu").Where("promotion_id = ?", promotionID).Find(&menus)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    if len(menus) == 0 {
        c.JSON(http.StatusNoContent, nil) 
        return
    }

    var response []map[string]interface{}
    for _, menu := range menus {
        response = append(response, map[string]interface{}{
            "menu_id": menu.MenuID,
            "name": menu.Menu.Name, 
        })
    }

    c.JSON(http.StatusOK, response)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var conditionData struct {
        PromotionID uint `json:"promotion_id"`
        Menu        []struct {
            MenuID uint `json:"menu_id"`
        } `json:"menu"`
    }

    // Bind the incoming JSON payload to the struct
    if err := c.ShouldBindJSON(&conditionData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // Check if the promotion exists
    var promotion entity.Promotion
    db.First(&promotion, conditionData.PromotionID)
    if promotion.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
        return
    }

    // Get the current conditions for this promotion
    var currentCondition []entity.Condition
    db.Where("promotion_id = ?", conditionData.PromotionID).Find(&currentCondition)

    // Create a map to track the new MenuIDs from the request
    newMenuMap := make(map[uint]bool)
    for _, menuData := range conditionData.Menu {
        newMenuMap[menuData.MenuID] = true
    }

    // Update or add new conditions
    for _, menuData := range conditionData.Menu {
        var condition entity.Condition
        result := db.Where("promotion_id = ? AND menu_id = ?", conditionData.PromotionID, menuData.MenuID).First(&condition)

        if result.RowsAffected == 0 {
            // If it doesn't exist, create a new condition
            newCondition := entity.Condition{
                PromotionID: conditionData.PromotionID,
                MenuID:      menuData.MenuID,
            }

            if err := db.Create(&newCondition).Error; err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
                return
            }
        }
    }

    // Remove conditions that are no longer in the new update
    for _, currentMenu := range currentCondition {
        if _, exists := newMenuMap[currentMenu.MenuID]; !exists {
            if err := db.Delete(&entity.Condition{}, "promotion_id = ? AND menu_id = ?", conditionData.PromotionID, currentMenu.MenuID).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete condition for MenuID: " + fmt.Sprint(currentMenu.MenuID)})
                return
            }
        }
    }

    c.JSON(http.StatusOK, gin.H{"message": "Promotion menu updated successfully"})
}


// Delete removes a menu by ID
func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Exec("DELETE FROM condition WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
