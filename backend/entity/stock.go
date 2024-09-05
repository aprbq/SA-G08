package entity

import (
	"gorm.io/gorm"
)

type Stock struct {
	gorm.Model
	Stock string      `json:"stock"`

	Menu  []Menu `gorm:"foreignKey:StockID"`
	
}
