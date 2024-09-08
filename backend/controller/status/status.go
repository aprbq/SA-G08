package status

import (
	"net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    var status []entity.Status
    db := config.DB()
    db.Find(&status)

    c.JSON(http.StatusOK, &status)
}