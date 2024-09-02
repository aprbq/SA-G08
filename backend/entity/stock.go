package entity

import (
	"gorm.io/gorm"
)

type Stock struct {
	gorm.Model
	StockName string      `json:"stock_name"`

	Menu  []Menu `gorm:"foreignKey:StockID"`
	
}
