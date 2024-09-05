package entity

import (
	"gorm.io/gorm"
)

type Condition struct {
	gorm.Model

	PromotionID uint     `json:"promotion_id"`
	Promotion   Promotion `gorm:"foreignKey:PromotionID" json:"promotion`

	MenuID uint `json:"menu_id"`
	Menu   Menu  `gorm:"foreignKey:MenuID" json:"menu`
}
