package main

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/category"
	"example.com/sa-67-example/controller/class"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/ingredients"
	"example.com/sa-67-example/controller/menus"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/entity"
	"example.com/sa-67-example/middlewares"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)
	const PORT = "8000"

func main() {
	db, err := gorm.Open(sqlite.Open("SA-G08.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

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
		 router.Use(middlewares.Authorizes())
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
	 }
 
	 r.GET("/genders", genders.GetAll)
	 r.GET("/class", class.GetAll)
	 r.GET("/category", category.GetAll)
	 r.GET("/", func(c *gin.Context) {
		 c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	 })
 
	 // Run the server
	 r.Run("localhost:" + PORT)


	// Migrate the schema
	db.AutoMigrate(&entity.Genders{},&entity.Users{}, &entity.Employee{},&entity.Class{}, &entity.Category{},
		&entity.Payments{}, &entity.Member{}, &entity.Menu{},&entity.Ingredients{},
		&entity.MenuIngredient{}, &entity.Order{}, &entity.OrderItem{},
		&entity.OrderHasMenu{}, &entity.Condition{}, &entity.Promotion{},
		&entity.PointsTransactions{})
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
