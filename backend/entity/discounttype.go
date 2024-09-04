package entity

import (
	"gorm.io/gorm"
)

type DiscountType struct {
	gorm.Model

	DiscountTypeName string `json:"discount_type_name"`
	
	Promotion []Promotion `gorm:"foreignKey:DiscountTypeID"`


}
