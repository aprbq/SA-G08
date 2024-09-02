package entity

import (
	"gorm.io/gorm"
)

type Condition struct {
	gorm.Model

	PromotionID *uint     `json:"promotion_id"`
	Promotion   Promotion `gorm:"foriegnKey:MenuID" json:"promotion`

	MenuID *uint `json:"menu_id"`
	Menu   Menu  `gorm:"foriegnKey:MenuID" json:"menu`
}
