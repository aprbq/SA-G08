package entity

import (
	"gorm.io/gorm"
)

type Status struct {
	gorm.Model

	Promotion  []Promotion `gorm:"foreignKey:StatusID"`
	StatusName string      `json:"status_name"`
}
