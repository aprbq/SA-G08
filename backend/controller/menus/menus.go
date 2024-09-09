package menus

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)

// func CreateMenu(c *gin.Context) {
// 	var promotion entity.Promotion


// 	db := config.DB()

	
// 	var status entity.Status
// 	db.First(&status, promotion.StatusID)
// 	if status.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
// 		return
// 	}

//     var users entity.Users
// 	db.First(&users, promotion.UsersID)
// 	if users.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
// 		return
// 	}

//     var promotion_type entity.PromotionType
// 	db.First(&promotion_type,promotion.DiscountTypeID)
// 	if promotion_type.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
// 		return
// 	}

//     var discount_type entity.DiscountType
// 	db.First(&discount_type, promotion.DiscountTypeID)
// 	if discount_type.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
// 		return
// 	}


	
// 	u := entity.Promotion{
// 		PromotionName: promotion.PromotionName, //  
// 		Description:  promotion.Description,  //  
// 		StartDate:     promotion.StartDate,     //  
// 		EndDate:  promotion.EndDate,
// 		PointsAdded:  promotion.PointsAdded,
// 		PointsUse:   promotion.PointsUse, //  
// 		DiscountValue:  promotion.DiscountValue,
// 		DiscountTypeID:    promotion.DiscountTypeID,
//         DiscountType:    discount_type,
//         PromotionTypeID:    promotion.PromotionTypeID,
//         PromotionType:    promotion_type,
//         StatusID:    promotion.StatusID,
//         Status:    status,
//         UsersID:    promotion.UsersID,
//         Users:    users, //   
// 	}

// 	// บันทึก
// 	if err := db.Create(&u).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
// }

// GetAll retrieves all menu along with their associated class
func GetAll(c *gin.Context) {
    var menus []entity.Menu
    db := config.DB()
    results := db.Preload("Category").Find(&menus)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, menus)
}

// Get retrieves a single menu by ID along with their associated class
func Get(c *gin.Context) {
    ID := c.Param("id")
    var menu entity.Menu
    db := config.DB()
    results := db.Preload("Category").First(&menu, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if menu.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, menu)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var menu entity.Menu
    menuID := c.Param("id")
    db := config.DB()

    result := db.First(&menu, menuID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&menu); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&menu)
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

    if tx := db.Exec("DELETE FROM menus WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
