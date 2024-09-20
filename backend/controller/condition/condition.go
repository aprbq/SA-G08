package condition

import (
    "net/http"


    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
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
	var condition entity.Condition
	ConditionID := c.Param("id")
	db := config.DB()

	result := db.First(&condition, ConditionID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&condition); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&condition)
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

	if tx := db.Exec("DELETE FROM promotions WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
