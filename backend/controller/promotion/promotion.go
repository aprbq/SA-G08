package promotion

import (
	"net/http"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreatePromotion(c *gin.Context) {
	var promotion entity.Promotion

	// Bind JSON to promotion struct
	if err := c.ShouldBindJSON(&promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate dates
	if promotion.StartDate.After(promotion.EndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date must be before end_date"})
		return
	}

	db := config.DB()

	// Check for Status
	var status entity.Status
	if err := db.First(&status, promotion.StatusID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "status not found"})
		return
	}

	// Check for Promotion Type
	var promotionType entity.PromotionType
	if err := db.First(&promotionType, promotion.PromotionTypeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "promotion_type not found"})
		return
	}

	// Check for Discount Type
	var discountType entity.DiscountType
	if err := db.First(&discountType, promotion.DiscountTypeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "discount_type not found"})
		return
	}

	// Check for Employee
	var employee entity.Employee
	if err := db.First(&employee, promotion.EmployeeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}

	// Create new Promotion
	newPromotion := entity.Promotion{
		PromotionName:     promotion.PromotionName,
		Description:       promotion.Description,
		StartDate:         promotion.StartDate,
		EndDate:           promotion.EndDate,
		PointsAdded:       promotion.PointsAdded,
		PointsUse:         promotion.PointsUse,
		DiscountValue:     promotion.DiscountValue,
		DiscountTypeID:    promotion.DiscountTypeID,
		DiscountType:      discountType,
		PromotionTypeID:   promotion.PromotionTypeID,
		PromotionType:     promotionType,
		StatusID:          promotion.StatusID,
		Status:            status,
		EmployeeID:        promotion.EmployeeID,
		Employee:          employee,
	}

	// Save Promotion
	if err := db.Create(&newPromotion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": newPromotion.ID})
}

// GetAll retrieves all promotion along with their associated class
func GetAll(c *gin.Context) {
    var promotion []entity.Promotion
    db := config.DB()
    results := db.Preload("Status").Preload("DiscountType").Preload("PromotionType").Preload("Employee").Find(&promotion)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, promotion)
}

// Get retrieves a single promotion by ID along with their associated class
func Get(c *gin.Context) {
    ID := c.Param("id")
    var promotion entity.Promotion
    db := config.DB()
    results := db.Preload("Status").Preload("DiscountType").Preload("PromotionType").Preload("Employee").First(&promotion, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if promotion.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, promotion)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var promotion entity.Promotion
    PromotionID := c.Param("id")
    db := config.DB()

    result := db.First(&promotion, PromotionID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }
    if err := c.ShouldBindJSON(&promotion); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }
    result = db.Save(&promotion)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// Delete removes a menu by ID
func DeleteConditionsByPromotionID(promotionID uint) error {
	db := config.DB()
	
	// ลบเงื่อนไขทั้งหมดที่มี PromotionID ตรงกัน
	if err := db.Where("promotion_id = ?", promotionID).Delete(&entity.Condition{}).Error; err != nil {
		return err
	}

	return nil
}

func Delete(c *gin.Context) {
    var promotion entity.Promotion
	promotionID := c.Param("id")

	// ค้นหาข้อมูลโปรโมชั่น
	db := config.DB()
	db.First(&promotion, promotionID)
	if promotion.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "promotion not found"})
		return
	}

	// ลบเงื่อนไขที่เกี่ยวข้อง
	if err := DeleteConditionsByPromotionID(promotion.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete conditions"})
		return
	}

	// ลบโปรโมชั่น
	if err := db.Delete(&promotion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion deleted successfully"})
}
