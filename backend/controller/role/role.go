package role

import (
	"net/http"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
    var role []entity.Role
    db := config.DB()
    db.Find(&role)

    c.JSON(http.StatusOK, &role)
}