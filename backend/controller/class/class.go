package class

import (
    "net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    db := config.DB()
    var class []entity.Class
    db.Find(&class)

    c.JSON(http.StatusOK, &class)
}