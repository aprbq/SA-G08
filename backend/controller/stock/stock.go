package stock

import (
    "net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    db := config.DB()
    var stock []entity.Stock
    db.Find(&stock)

    c.JSON(http.StatusOK, &stock)
}