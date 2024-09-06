package category

import (
    "net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    db := config.DB()
    var category []entity.Category
    db.Find(&category)
    c.JSON(http.StatusOK, &category)
}