// package order

// import (
// 	"net/http"

// 	"example.com/sa-67-example/config"
// 	"example.com/sa-67-example/entity"
// 	"github.com/gin-gonic/gin"
// )

// func CreateOrder(c *gin.Context) {
// 	var order entity.Order

//     if err := c.ShouldBindJSON(&order); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	db := config.DB()
    

// 	// ค้นหา gender ด้วย id
// 	var promotion entity.Promotion
// 	db.First(&promotion, order.PromotionID)
// 	if promotion.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "promotion not found"})
// 		return
// 	}

//     var paymentmethod entity.Paymentmethod
// 	db.First(&paymentmethod,order.PaymentmethodID)
// 	if paymentmethod.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "paymentmethod not found"})
// 		return
// 	}

//     // var discount_type entity.DiscountType
// 	// db.First(&discount_type, promotion.DiscountTypeID)
// 	// if discount_type.ID == 0 {
// 	// 	c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
// 	// 	return
// 	// }

//     var employee entity.Employee
//     db.First(&employee, order.Employee)
// 	if employee.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
// 		return
// 	}

// 	// สร้าง User
// 	u := entity.Order{
// 		OrderDate: order.OrderDate, //  
// 		PaymentAmount:  order.PaymentAmount,  //  
// 		// StartDate:     promotion.StartDate,     //  
// 		// EndDate:  promotion.EndDate,
// 		// PointsAdded:  promotion.PointsAdded,
// 		// PointsUse:   promotion.PointsUse, //  
// 		// DiscountValue:  promotion.DiscountValue,
// 		// DiscountTypeID:    promotion.DiscountTypeID,
//         // DiscountType:    discount_type,
        
//         PaymentmethodID:    order.PaymentmethodID,
//         Paymentmethod:    &paymentmethod,
//         PromotionID:    order.PromotionID,
//         Promotion:    &promotion,
//         EmployeeID: order.EmployeeID,
//         Employee: &employee,

// 	}

// 	// บันทึก
// 	if err := db.Create(&u).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
// }

// // GetAll retrieves all promotion along with their associated class
// func GetAll(c *gin.Context) {
//     var order []entity.Order
//     db := config.DB()
//     results := db.Preload("Paymentmethod").Preload("Promotion").Preload("Employee").Find(&order)

//     if results.Error != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
//         return
//     }
//     c.JSON(http.StatusOK, order)
// }

// // Get retrieves a single promotion by ID along with their associated class
// func Get(c *gin.Context) {
//     ID := c.Param("id")
//     var order entity.Order
//     db := config.DB()
//     results := db.Preload("Paymentmethod").Preload("Promotion").Preload("Employee").Find(&order,ID)

//     if results.Error != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
//         return
//     }
//     if order.ID == 0 {
//         c.JSON(http.StatusNoContent, gin.H{})
//         return
//     }
//     c.JSON(http.StatusOK, order)
// }

// // Update updates the details of an existing menu
// func Update(c *gin.Context) {
//     var order entity.Order
//     OrderID := c.Param("id")
//     db := config.DB()

//     result := db.First(&order, OrderID)
//     if result.Error != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
//         return
//     }

//     if err := c.ShouldBindJSON(&order); err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
//         return
//     }

//     result = db.Save(&order)
//     if result.Error != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
//         return
//     }
//     c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
// }

// // Delete removes a menu by ID
// func Delete(c *gin.Context) {
//     id := c.Param("id")
//     db := config.DB()

//     if tx := db.Exec("DELETE FROM orders WHERE id = ?", id); tx.RowsAffected == 0 {
//         c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
//         return
//     }
//     c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
// }

package order

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	var order entity.Order

    // ตรวจสอบข้อมูลจาก JSON Payload
    if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่ามี Promotion ที่ใช้ได้หรือไม่
	var promotion entity.Promotion
	db.First(&promotion, order.PromotionID)
	if promotion.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "promotion not found"})
		return
	}

	// ตรวจสอบว่ามี Paymentmethod ที่ใช้ได้หรือไม่
	var paymentmethod entity.Paymentmethod
	db.First(&paymentmethod, order.PaymentmethodID)
	if paymentmethod.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "paymentmethod not found"})
		return
	}

	// ตรวจสอบพนักงาน (Employee)
	var employee entity.Employee
	db.First(&employee, order.EmployeeID)
	if employee.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}

	// สร้าง Order
	newOrder := entity.Order{
		OrderDate:      order.OrderDate,
		PaymentAmount:  order.PaymentAmount,
		PaymentAmountBefore:  order.PaymentAmountBefore,
		EmployeeID:     order.EmployeeID,
		Employee:       &employee,
		PromotionID:    order.PromotionID,
		Promotion:      &promotion,
		PaymentmethodID: order.PaymentmethodID,
		Paymentmethod:  &paymentmethod,
	}

	// บันทึก Order
	if err := db.Create(&newOrder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึก Orderitem ที่เกี่ยวข้องทั้งหมด
	for _, item := range order.Orderitem {
		item.OrderID = newOrder.ID // เชื่อมโยง OrderID ให้กับ Orderitem
		if err := db.Create(&item).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "data": newOrder})
}


func GetAll(c *gin.Context) {
	var orders []entity.Order
	db := config.DB()
	results := db.Preload("Paymentmethod").Preload("Promotion").Preload("Employee").Preload("Orderitem").Preload("MemberOrderHistory").Find(&orders)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func Get(c *gin.Context) {
	ID := c.Param("id")
	var order entity.Order
	db := config.DB()
	results := db.Preload("Paymentmethod").Preload("Promotion").Preload("Employee").Preload("Orderitem").Preload("MemberOrderHistory").Find(&order, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if order.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, order)
}

func Update(c *gin.Context) {
	var order entity.Order
	OrderID := c.Param("id")
	db := config.DB()

	result := db.First(&order, OrderID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&order)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Exec("DELETE FROM orders WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
