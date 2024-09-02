package entity

import (
	"gorm.io/gorm"
)

type DiscountType struct {
	gorm.Model

	Promotion []Promotion `gorm:"foreignKey:DiscountTypeID"`

	DiscountTypeName string `json:"discount_type_name"`
}
