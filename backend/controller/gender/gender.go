package gender

import (
    "net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    db := config.DB()
    var gender []entity.Gender
    db.Find(&gender)

    c.JSON(http.StatusOK, &gender)
}