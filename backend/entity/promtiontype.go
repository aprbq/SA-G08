package entity

import (
	"gorm.io/gorm"
)

type PromotionType struct {
	gorm.Model
	PromotionTypeName string `json:"promotion_type_name"`

	Promotion []Promotion `gorm:"foreignKey:PromotionTypeID"`
}
