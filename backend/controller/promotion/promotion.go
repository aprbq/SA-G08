package promotion

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreatePromotion(c *gin.Context) {
	var promotion entity.Promotion

    if err := c.ShouldBindJSON(&promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
    

	// ค้นหา gender ด้วย id
	var status entity.Status
	db.First(&status, promotion.StatusID)
	if status.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "status not found"})
		return
	}

    var promotion_type entity.PromotionType
	db.First(&promotion_type,promotion.DiscountTypeID)
	if promotion_type.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}

    var discount_type entity.DiscountType
	db.First(&discount_type, promotion.DiscountTypeID)
	if discount_type.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}

	// สร้าง User
	u := entity.Promotion{
		PromotionName: promotion.PromotionName, //  
		Description:  promotion.Description,  //  
		StartDate:     promotion.StartDate,     //  
		EndDate:  promotion.EndDate,
		PointsAdded:  promotion.PointsAdded,
		PointsUse:   promotion.PointsUse, //  
		DiscountValue:  promotion.DiscountValue,
		DiscountTypeID:    promotion.DiscountTypeID,
        DiscountType:    discount_type,
        PromotionTypeID:    promotion.PromotionTypeID,
        PromotionType:    promotion_type,
        StatusID:    promotion.StatusID,
        Status:    status,
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
    var promotion []entity.Promotion
    db := config.DB()
    results := db.Preload("Status").Preload("DiscountType").Preload("PromotionType").Find(&promotion)

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
    results := db.Preload("Status").Preload("DiscountType").Preload("PromotionType").First(&promotion, ID)

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
    promotionID := c.Param("id")
    db := config.DB()

    result := db.First(&promotion, promotionID)
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
func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    if tx := db.Exec("DELETE FROM promotions WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
