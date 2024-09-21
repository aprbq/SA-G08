package entity

import (
	"time"

	"gorm.io/gorm"
)

type Ingredients struct {
	gorm.Model
	Name      string    `json:"name"`
	Quantity  float32   `json:"quantity"`
	UnitPrice float32   `json:"unit_price"`
	Price     float32   `json:"price"`
	ExpDate   time.Time `json:"exp_date"`

	ClassID uint  `json:"class_id"`
	Class   Class `gorm:"foreignKey: ClassID" json:"class"`

	EmployeeID uint     `json:"employee_id"`
	Employees  Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

	MenuIngredients []MenuIngredient `json:"menu_ingredients" gorm:"foreignKey:IngredientsID"`

	UnitID uint     `json:"unit_id"`
	Unit  Unit `gorm:"foreignKey:UnitID" json:"unit"`

	SuppliersID uint     `json:"suppliers_id"`
	Suppliers  Suppliers `gorm:"foreignKey:SuppliersID" json:"suppliers"`
}
