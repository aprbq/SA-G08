package payment

import (
	"net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    var payment []entity.Paymentmethod
    db := config.DB()
    db.Find(&payment)

    c.JSON(http.StatusOK, &payment)
}