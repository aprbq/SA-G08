package entity

import (
	
	"gorm.io/gorm"
)

type Menu struct {
	gorm.Model
	Name 		string    	`json:"name"`
	Description  	float32    	`json:"description"`
	Price  		float32    	`json:"price"`
	

	CategoryID  	*uint     	
	Category    	Category   	`gorm:"foreignKey: CategoryID"`

	MenuIngredientID  	*uint     	
	MenuIngredient     	MenuIngredient   	`gorm:"foreignKey: MenuIngredientID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`

	Condition []Condition `gorm:"foreignKey:MenuID"`

	Orderitem []Orderitem `gorm:"foreignKey:MenuID"`
}