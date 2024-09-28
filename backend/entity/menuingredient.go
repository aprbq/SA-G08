package entity

import "gorm.io/gorm"

type MenuIngredient struct {
	gorm.Model
	Quantity uint `json:"quantity"` // Field to store the quantity of the ingredient

	IngredientsID uint        `json:"ingredients_id"`                             // Foreign key for Ingredients
	Ingredients   Ingredients `gorm:"foreignKey:IngredientsID" json:"ingredient"` // Foreign key relationship

	MenuID uint `json:"menu_id"`                       // Foreign key for Menu
	Menu   Menu `gorm:"foreignKey:MenuID" json:"menu"` // Foreign key relationship
}
