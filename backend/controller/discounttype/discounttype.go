package discounttype

import (
	"net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    db := config.DB()
    var discounttype []entity.DiscountType
    db.Find(&discounttype)

    c.JSON(http.StatusOK, &discounttype)
}