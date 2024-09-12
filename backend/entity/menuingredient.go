package entity

import "gorm.io/gorm"

type MenuIngredient struct {
	gorm.Model
	Quantity int `json:"quantity"` // New field to store the quantity of the ingredient

	IngredientsID uint
	Ingredients   Ingredients `gorm:"foreignKey:IngredientsID"`

	MenuID uint
	Menu   Menu `gorm:"foreignKey:MenuID"`
}
