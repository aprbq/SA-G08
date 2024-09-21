// package payment

// import (
// 	"net/http"

//     "example.com/sa-67-example/config"
//     "example.com/sa-67-example/entity"
//     "github.com/gin-gonic/gin"
// )

// func GetAll(c *gin.Context) {
//     var payment []entity.Paymentmethod
//     db := config.DB()
//     db.Find(&payment)

//     c.JSON(http.StatusOK, &payment)
// }

package payment

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// GetAll retrieves all Paymentmethods
func GetAll(c *gin.Context) {
	var payment []entity.Paymentmethod
	db := config.DB()

	// ค้นหาข้อมูล Paymentmethod
	if err := db.Find(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve payment methods"})
		return
	}

	c.JSON(http.StatusOK, payment)
}
