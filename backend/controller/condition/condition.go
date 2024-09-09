package condition

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)



func CreatePromotion(c *gin.Context) {
	var condition entity.Condition

    if err := c.ShouldBindJSON(&condition); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
// GetAll retrieves all condition along with their associated class

db := config.DB()
    

// ค้นหา gender ด้วย id
var promotion entity.Promotion
db.First(&promotion,condition.PromotionID)
if promotion.ID == 0 {
    c.JSON(http.StatusNotFound, gin.H{"error": "promotion not found"})
    return
}

var menu entity.Menu
db.First(&menu,condition.MenuID)
if menu.ID == 0 {
    c.JSON(http.StatusNotFound, gin.H{"error": "menu not found"})
    return
}

// สร้าง User
u := entity.Condition{
    PromotionID:    condition.PromotionID,
    Promotion:    promotion,
    MenuID:    condition.MenuID,
    Menu:    menu,
}

// บันทึก
if err := db.Create(&u).Error; err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
}

c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
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
ID := c.Param("id")
var condition entity.Condition
db := config.DB()
results := db.Preload("Menu").Preload("Promotion").First(&condition, ID)

if results.Error != nil {
    c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
    return
}
if condition.ID == 0 {
    c.JSON(http.StatusNoContent, gin.H{})
    return
}
c.JSON(http.StatusOK, condition)
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
