package main

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/category"
	"example.com/sa-67-example/controller/class"
	"example.com/sa-67-example/controller/status"
	"example.com/sa-67-example/controller/promotiontype"
	"example.com/sa-67-example/controller/condition"
	"example.com/sa-67-example/controller/discounttype"
	"example.com/sa-67-example/controller/stock"
	"example.com/sa-67-example/controller/gender"
	"example.com/sa-67-example/controller/ingredients"
	"example.com/sa-67-example/controller/menuingredient"
	"example.com/sa-67-example/controller/menus"
	"example.com/sa-67-example/controller/promotion"
	"example.com/sa-67-example/controller/employee"
	"example.com/sa-67-example/controller/order"
	"example.com/sa-67-example/controller/orderitem"
	"example.com/sa-67-example/controller/ordersweet"
	//"example.com/sa-67-example/controller/payment"
	"example.com/sa-67-example/controller/member"
	"example.com/sa-67-example/middlewares"
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
	 r.POST("/signup", employee.SignUp)
	 r.POST("/signin", employee.SignIn)
 
	 router := r.Group("/")
	 {
		router.Use(middlewares.Authorizes())
		 // User Route
		//  router.PUT("/user/:id", users.Update)
		//  router.GET("/users", users.GetAll)
		//  router.GET("/user/:id", users.Get)
		//  router.DELETE("/user/:id", users.Delete)
		router.GET("/employee", employee.Get)

		router.PUT("/ingredient/:id", ingredients.Update)
        router.GET("/ingredient", ingredients.GetAll)
        router.GET("/ingredient/:id", ingredients.Get)
        router.DELETE("/ingredient/:id", ingredients.Delete)

		router.PUT("/menu/:id", menus.Update)
		router.POST("/menu", menus.CreateMenu)
        router.GET("/menu", menus.GetAll)
        router.GET("/menu/:id", menus.Get)
        router.DELETE("/menu/:id", menus.Delete)
		router.GET("/category", category.GetAll)
		router.GET("/stock", stock.GetAll)

		router.PUT("/order/:id", order.Update)
        router.GET("/order", order.GetAll)
        router.GET("/order/:id", order.Get)
        router.DELETE("/order/:id", order.Delete)
		router.GET("/ordersweet", ordersweet.GetAll)

		// router.PUT("/orderitem/:id", orderitem.Update)
        // router.GET("/orderitem", orderitem.GetAll)
        // router.GET("/orderitem/:id", orderitem.Get)
        // router.DELETE("/orderitem/:id", orderitem.Delete)
		router.POST("/orderitem", orderitem.CreateOrderitem)
        

		// router.PUT("/payment/:id", payment.Update)
        // router.GET("/payment", payment.GetAll)
        // router.GET("/payment/:id", payment.Get)
        // router.DELETE("/payment/:id", payment.Delete)

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
		router.POST("/condition", condition.CreateCondition)

		router.PUT("/member/:id", member.Update)
        router.GET("/member", member.GetAll)
        router.GET("/member/:id", member.Get)
        router.DELETE("/member/:id", member.Delete)


	 }

	 r.GET("/gender", gender.GetAll)
	 r.GET("/class", class.GetAll)
	 
	 
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
