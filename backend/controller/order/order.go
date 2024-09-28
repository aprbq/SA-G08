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

	var member entity.Member
	db.First(&member, order.MemberID)
	if member.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "member not found"})
		return
	}

	// สร้าง Order
	newOrder := entity.Order{
		OrderDate:      order.OrderDate,
		PaymentAmount:  order.PaymentAmount,
		PaymentAmountBefore:  order.PaymentAmountBefore,
		PointsTransactions: order.PointsTransactions,
		EmployeeID:     order.EmployeeID,
		Employee:       &employee,
		PromotionID:    order.PromotionID,
		Promotion:      &promotion,
		PaymentmethodID: order.PaymentmethodID,
		Paymentmethod:  &paymentmethod,
		MemberID: order.MemberID,
		Member:  &member,
		
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
	results := db.Preload("Paymentmethod").Preload("Promotion").Preload("Employee").Preload("Orderitem").Preload("Member").Find(&orders)

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
	results := db.Preload("Paymentmethod").Preload("Promotion").Preload("Employee").Preload("Orderitem").Preload("Member").Find(&order, ID)

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


