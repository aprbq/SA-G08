package orderitem

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreateOrderitem(c *gin.Context) {
	var orderitem entity.Orderitem

    if err := c.ShouldBindJSON(&orderitem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
    

	// ค้นหา gender ด้วย id
	var ordersweet entity.Ordersweet
	db.First(&ordersweet, orderitem.OrdersweetID)
	if ordersweet.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "ordersweet not found"})
		return
	}

    var order entity.Order
	db.First(&order,orderitem.OrderID)
	if order.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}

    // var discount_type entity.DiscountType
	// db.First(&discount_type, promotion.DiscountTypeID)
	// if discount_type.ID == 0 {
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
	// 	return
	// }

    // var employee entity.Employee
    // db.First(&employee, promotion.Employee)
	// if employee.ID == 0 {
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
	// 	return
	// }

	// สร้าง User
	u := entity.Orderitem{
		Quantity: orderitem.Quantity, //  
		TotalItem:  orderitem.TotalItem,  //  
		// StartDate:     promotion.StartDate,     //  
		// EndDate:  promotion.EndDate,
		// PointsAdded:  promotion.PointsAdded,
		// PointsUse:   promotion.PointsUse, //  
		// DiscountValue:  promotion.DiscountValue,
		
		OrdersweetID:    orderitem.OrdersweetID,
        Ordersweet:    &ordersweet,
        OrderID:    orderitem.OrderID,
        Order:    &order,
        // StatusID:    promotion.StatusID,
        // Status:    status,
        // EmployeeID: promotion.EmployeeID,
        // Employee: employee,

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
    var orderitem []entity.Orderitem
    db := config.DB()
    results := db.Preload("Ordersweet").Preload("Order").Find(&orderitem)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, orderitem)
}

// Get retrieves a single promotion by ID along with their associated class
func Get(c *gin.Context) {
    ID := c.Param("id")
    var orderitem entity.Orderitem
    db := config.DB()
    results := db.Preload("Ordersweet").Preload("Order").First(&orderitem, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if orderitem.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, orderitem)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var orderitem entity.Orderitem
    OrderitemID := c.Param("id")
    db := config.DB()

    result := db.First(&orderitem, OrderitemID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&orderitem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&orderitem)
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

    if tx := db.Exec("DELETE FROM orderitems WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
