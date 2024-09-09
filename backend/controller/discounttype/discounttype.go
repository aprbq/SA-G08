package discounttype

import (
	"net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    var discounttype []entity.DiscountType
    db := config.DB()
    db.Find(&discounttype)

    c.JSON(http.StatusOK, &discounttype)
}