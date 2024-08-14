package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payments struct {
	gorm.Model
	PromotionName string
	Description   string
	StartDate     time.Time
	End_Date      time.Time
	PointsAdded   int
	PointsUse     int
	DiscountValue int
	DiscountType  string
	Status        string

	Order []Order `gorm:"foreignKey:PaymentID"`

	
}
