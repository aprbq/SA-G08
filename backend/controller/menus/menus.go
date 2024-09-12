package menus

import (
	"net/http"

	"example.com/sa-67-example/config"
	// "example.com/sa-67-example/controller/employee"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreateMenu(c *gin.Context) {
    var menu entity.Menu
    var menuIngredients []entity.MenuIngredient

    // Bind the JSON payload to the menu struct
    if err := c.ShouldBindJSON(&menu); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // Check if Category exists
    var category entity.Category
    db.First(&category, menu.CategoryID)
    if category.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        return
    }

    // Check if Stock exists
    var stock entity.Stock
    db.First(&stock, menu.StockID)
    if stock.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Stock not found"})
        return
    }

    // Check if Employee exists
    var employee entity.Employee
    db.First(&employee, menu.EmployeeID)
    if employee.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
        return
    }

    // Create the Menu
    u := entity.Menu{
        Name:        menu.Name,
        Description: menu.Description,
        Price:       menu.Price,
        Picture:     menu.Picture,
        CategoryID:  menu.CategoryID,
        Category:    category,
        StockID:     menu.StockID,
        Stock:       stock,
        EmployeeID:  menu.EmployeeID,
        Employee:    employee,
    }

    // Save the Menu to the database
    if err := db.Create(&u).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Process MenuIngredients (assuming you get this as part of the request)
    if menu.MenuIngredients != nil {
        for _, mi := range menu.MenuIngredients {
            mi.MenuID = u.ID // Associate the MenuIngredient with the newly created menu
            menuIngredients = append(menuIngredients, mi)
        }

        // Save the MenuIngredients to the database
        if err := db.Create(&menuIngredients).Error; err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created successfully", "data": u})
}


// GetAll retrieves all menu along with their associated class
func GetAll(c *gin.Context) {
    var menus []entity.Menu
    db := config.DB()
    results := db.Preload("Category").Preload("Stock").Preload("Employee").Find(&menus)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, menus)
}

// Get retrieves a single menu by ID along with their associated class
func Get(c *gin.Context) {
    ID := c.Param("id")
    var menu entity.Menu
    db := config.DB()
    results := db.Preload("Category").Preload("Stock").Preload("Employee").First(&menu, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if menu.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, menu)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var menu entity.Menu
    menuID := c.Param("id")
    db := config.DB()

    result := db.First(&menu, menuID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&menu); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&menu)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// Delete removes a menu by ID
func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    if tx := db.Exec("DELETE FROM menus WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
