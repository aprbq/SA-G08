package entity

import (
	"gorm.io/gorm"
)

type Menu struct {
	gorm.Model
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float32 `json:"price"`
	Picture     string  `gorm:"type:longtext" json:"picture"`

	CategoryID uint     `json:"category_id"`
	Category   Category `gorm:"foreignKey: CategoryID"`

	StockID uint  `json:"stock_id"`
	Stock   Stock `gorm:"foreignKey:StockID" json: "stock"`

	EmployeeID uint     `json:"employee_id"`
	Employee   Employee `gorm:"foreignKey:EmployeeID" json: "employee"`

	MenuIngredients []MenuIngredient `json:"menu_ingredients" gorm:"foreignKey:MenuID"`

	Condition []Condition `gorm:"foreignKey:MenuID"`

	Orderitem []Orderitem `gorm:"foreignKey:MenuID"`
}
