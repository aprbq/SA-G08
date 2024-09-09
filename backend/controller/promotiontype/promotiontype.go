package promotiontype

import (
	"net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    var promotiontype []entity.PromotionType
    db := config.DB()
    db.Find(&promotiontype)

    c.JSON(http.StatusOK, &promotiontype)
}