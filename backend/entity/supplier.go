package entity

import (
	"gorm.io/gorm"
)

type Suppliers struct {
	gorm.Model
	Name    string `json:"name"`
	Address string `json:"address"`
	Tel     string `json:"tel"`

	Ingredient []Ingredients `gorm:"foreignKey:SuppliersID"` // ความสัมพันธ์แบบ one-to-many
}