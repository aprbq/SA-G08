package entity

import (
	
	"gorm.io/gorm"
)

type Menu struct {
	gorm.Model
	Name 		string    	`json:"name"`
	Description  	string    	`json:"description"`
	Price  		float32    	`json:"price"`
	

	CategoryID  	uint     	`json:"category_id"`
	Category    	*Category   	`gorm:"foreignKey: CategoryID"`

	MenuIngredientID  	uint     	`json:"menuingredient_id"`
	MenuIngredient     	*MenuIngredient   	`gorm:"foreignKey: MenuIngredientID"`

	UsersID 		uint	`json:"users_id"`
	Users   		*Users `gorm:"foriegnKey:UsersID"`

	Condition []Condition `gorm:"foreignKey:MenuID"`

	OrderHasMenu []OrderHasMenu `gorm:"foreignKey:MenuID"`
}