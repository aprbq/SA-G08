package ordersweet

import (
	"net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    var ordersweet []entity.Ordersweet
    db := config.DB()
    db.Find(&ordersweet)

    c.JSON(http.StatusOK, &ordersweet)
}