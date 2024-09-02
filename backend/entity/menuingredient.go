package entity

import "gorm.io/gorm"

type MenuIngredient struct {
	gorm.Model
	// MenuQuantity  int
	
	IngredientsID *uint
	Ingredients   Ingredients `gorm:"foriegnKey:IngredientsID"`

	MenuID *uint
	Menu   Menu `gorm:"foriegnKey:MenuID"`
	
}
