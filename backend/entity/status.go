package entity

import (
	"gorm.io/gorm"
)

type Status struct {
	gorm.Model
	StatusName string      `json:"status_name"`

	Promotion  []Promotion `gorm:"foreignKey:StatusID"`

	Member  []Member `gorm:"foreignKey:StatusID"`
	
}
