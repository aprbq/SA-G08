package entity

import "gorm.io/gorm"

type MenuIngredient struct {
	gorm.Model
	// MenuQuantity  int
	
	IngredientsID uint
	Ingredients   Ingredients `gorm:"foreignKey:IngredientsID"`

	MenuID uint
	Menu   Menu `gorm:"foreignKey:MenuID"`
	
}
