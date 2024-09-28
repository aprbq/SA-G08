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

	// ค้นหา Ordersweet ด้วย id
	var ordersweet entity.Ordersweet
	db.First(&ordersweet, orderitem.OrdersweetID)
	if ordersweet.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "ordersweet not found"})
		return
	}

	// ค้นหา Order ด้วย id (ถ้าจำเป็น)
	if orderitem.OrderID != 0 {
		var order entity.Order
		db.First(&order, orderitem.OrderID)
		if order.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
			return
		}
	}

    var menu entity.Menu
    db.First(&menu, orderitem.Menu)
	if menu.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "menu not found"})
		return
	}

	// สร้าง Orderitem
	u := entity.Orderitem{
		Quantity:     orderitem.Quantity,
		TotalItem:    orderitem.TotalItem,
		OrdersweetID: orderitem.OrdersweetID,
		Ordersweet:   &ordersweet,
		OrderID:      orderitem.OrderID,
		MenuID:       orderitem.MenuID,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

func GetAll(c *gin.Context) {
	var orderitems []entity.Orderitem
	db := config.DB()
	results := db.Preload("Ordersweet").Preload("Order").Find(&orderitems)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, orderitems)
}

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

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Exec("DELETE FROM orderitems WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
