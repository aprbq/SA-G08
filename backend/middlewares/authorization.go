package middlewares

import (
    "net/http"
    "strings"

    "example.com/sa-67-example/services"
    "github.com/gin-gonic/gin"
)

var HashKey = []byte("very-secret")
var BlockKey = []byte("a-lot-secret1234")

// Authorizes เป็นฟังก์ชั่นตรวจเช็ค Cookie
func Authorizes() gin.HandlerFunc {
    return func(c *gin.Context) {
        clientToken := c.Request.Header.Get("Authorization")
        if clientToken == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "no authorization header provided"})
            return
        }

        extractedToken := strings.Split(clientToken, "Bearer ")
        if len(extractedToken) == 2 {
            clientToken = strings.TrimSpace(extractedToken[1])
        } else {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "incorrect format of authorization token"})
            return
        }

        jwtWrapper := services.JwtWrapper{
            SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
            Issuer:    "AuthService",
        }

        _, err := jwtWrapper.ValidateToken(clientToken)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            return
        }

        c.Next()
    }
}
