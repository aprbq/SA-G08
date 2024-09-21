package main

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/category"
	"example.com/sa-67-example/controller/class"
	"example.com/sa-67-example/controller/condition"
	"example.com/sa-67-example/controller/discounttype"
	"example.com/sa-67-example/controller/employee"
	"example.com/sa-67-example/controller/gender"
	"example.com/sa-67-example/controller/ingredients"
	"example.com/sa-67-example/controller/menuingredient"
	"example.com/sa-67-example/controller/menus"
	"example.com/sa-67-example/controller/order"
	"example.com/sa-67-example/controller/orderitem"
	"example.com/sa-67-example/controller/ordersweet"
	"example.com/sa-67-example/controller/payment"
	"example.com/sa-67-example/controller/promotion"
	"example.com/sa-67-example/controller/promotiontype"
	"example.com/sa-67-example/controller/status"
	"example.com/sa-67-example/controller/stock"

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

	rounter := r.Group("/")
	{
		rounter.Use(middlewares.Authorizes())
		// User Route
		//  r.PUT("/user/:id", users.Update)
		//  r.GET("/users", users.GetAll)
		//  r.GET("/user/:id", users.Get)
		//  r.DELETE("/user/:id", users.Delete)
		rounter.GET("/employee", employee.Get)

		rounter.PUT("/ingredient/:id", ingredients.Update)
		rounter.GET("/ingredient", ingredients.GetAll)
		rounter.GET("/ingredient/:id", ingredients.Get)
		rounter.POST("/ingredient", ingredients.CreateIngredient)
		rounter.DELETE("/ingredient/:id", ingredients.Delete)
		rounter.GET("/class", class.GetAll)

		rounter.PUT("/menu/:id", menus.Update)
		rounter.POST("/menu", menus.CreateMenu)
		rounter.GET("/menu", menus.GetAll)
		rounter.GET("/menu/:id", menus.Get)
		rounter.DELETE("/menu/:id", menus.Delete)
		rounter.GET("/category", category.GetAll)
		rounter.GET("/stock", stock.GetAll)

		rounter.PUT("/order/:id", order.Update)
		rounter.GET("/order", order.GetAll)
		rounter.POST("/order", order.CreateOrder)
		rounter.GET("/order/:id", order.Get)
		rounter.DELETE("/order/:id", order.Delete)
		rounter.GET("/ordersweet", ordersweet.GetAll)
		rounter.GET("/payment", payment.GetAll)

		// r.PUT("/orderitem/:id", orderitem.Update)
		// r.GET("/orderitem", orderitem.GetAll)
		// r.GET("/orderitem/:id", orderitem.Get)
		// r.DELETE("/orderitem/:id", orderitem.Delete)
		rounter.POST("/orderitem", orderitem.CreateOrderitem)

		// r.PUT("/payment/:id", payment.Update)
		// r.GET("/payment", payment.GetAll)
		// r.GET("/payment/:id", payment.Get)
		// r.DELETE("/payment/:id", payment.Delete)

		rounter.POST("/menuingredient", menuingredient.CreateMenuIngredient)
		rounter.PUT("/menuingredient/:id", menuingredient.Update)
		rounter.GET("/menuingredient", menuingredient.GetAll)
		rounter.GET("/menuingredient/:id", menuingredient.Get)
		rounter.DELETE("/menuingredient/:id", menuingredient.Delete)

		rounter.PUT("/promotion/:id", promotion.Update)
		rounter.POST("/promotion", promotion.CreatePromotion)
		rounter.GET("/promotion", promotion.GetAll)
		rounter.GET("/promotion/:id", promotion.Get)
		rounter.DELETE("/promotion/:id", promotion.Delete)
		rounter.GET("/status", status.GetAll)
		rounter.GET("/promotiontype", promotiontype.GetAll)
		rounter.GET("/discounttype", discounttype.GetAll)
		rounter.POST("/condition", condition.CreateCondition)
		rounter.GET("/condition", condition.GetAll)
		rounter.GET("/condition/:id", condition.Get)

		rounter.POST("/member", member.CreateMember)
		rounter.PUT("/member/:id", member.Update)
		rounter.GET("/member", member.GetAll)
		rounter.GET("/member/:id", member.Get)
		rounter.DELETE("/member/:id", member.Delete)

	}

	r.GET("/gender", gender.GetAll)

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
