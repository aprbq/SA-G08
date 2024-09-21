package entity

import "gorm.io/gorm"

type Unit struct {
	gorm.Model
	Unit string `json:"unit"`

	Ingredients []Ingredients `gorm:"foreignKey:UnitID"`

}