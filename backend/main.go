package main

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/category"
	"example.com/sa-67-example/controller/class"
	"example.com/sa-67-example/controller/status"
	"example.com/sa-67-example/controller/promotiontype"
	"example.com/sa-67-example/controller/discounttype"
	"example.com/sa-67-example/controller/stock"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/ingredients"
	"example.com/sa-67-example/controller/menuingredient"
	"example.com/sa-67-example/controller/menus"
	"example.com/sa-67-example/controller/promotion"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/controller/order"
	"github.com/gin-gonic/gin"

)
	const PORT = "8000"

func main() {
	
	 // open connection database
	 config.ConnectionDB()

	 // Generate databases
	 config.SetupDatabase()
 
	 r := gin.Default()
	 r.Use(CORSMiddleware())
 
	 // Auth Route
	 r.POST("/signup", users.SignUp)
	 r.POST("/signin", users.SignIn)
 
	 router := r.Group("/")
	 {
		 // User Route
		 router.PUT("/user/:id", users.Update)
		 router.GET("/users", users.GetAll)
		 router.GET("/user/:id", users.Get)
		 router.DELETE("/user/:id", users.Delete)

		router.PUT("/ingredient/:id", ingredients.Update)
        router.GET("/ingredient", ingredients.GetAll)
        router.GET("/ingredient/:id", ingredients.Get)
        router.DELETE("/ingredient/:id", ingredients.Delete)

		router.PUT("/menu/:id", menus.Update)
        router.GET("/menu", menus.GetAll)
        router.GET("/menu/:id", menus.Get)
        router.DELETE("/menu/:id", menus.Delete)

		router.PUT("/order/:id", order.Update)
        router.GET("/order", order.GetAll)
        router.GET("/order/:id", order.Get)
        router.DELETE("/order/:id", order.Delete)

		router.PUT("/menuingredient/:id", menuingredient.Update)
        router.GET("/menuingredient", menuingredient.GetAll)
        router.GET("/menuingredient/:id", menuingredient.Get)
        router.DELETE("/menuingredient/:id", menuingredient.Delete)

		router.PATCH("/promotion/:id", promotion.Update)
		router.POST("/promotion", promotion.CreatePromotion)
        router.GET("/promotion", promotion.GetAll)
        router.GET("/promotion/:id", promotion.Get)
        router.DELETE("/promotion/:id", promotion.Delete)
		router.GET("/status", status.GetAll)
		router.GET("/promotiontype", promotiontype.GetAll)
		router.GET("/discounttype", discounttype.GetAll)


	 }

	 r.GET("/genders", genders.GetAll)
	 r.GET("/class", class.GetAll)
	 r.GET("/category", category.GetAll)
	 r.GET("/stock", stock.GetAll)
	 r.GET("/", func(c *gin.Context) {
		 c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	 })
 
	 // Run the server
	 r.Run("localhost:" + PORT)


	// Migrate the schema
	
}
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
