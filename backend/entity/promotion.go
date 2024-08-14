package entity

import (
	"time"

	"gorm.io/gorm"
)

type Promotion struct {
	gorm.Model
	PromotionName string
	Description   string
	StartDate     time.Time
	EndDate      time.Time
	PointsAdded   int
	PointsUse     int
	DiscountValue int
	DiscountType  string
	Status        string

	PointsTransactions []PointsTransactions `gorm:"foreignKey:PromotionID"`

	Order []Order `gorm:"foreignKey:PromotionID"`

	ConditionID *uint
	Condition   Condition `gorm:"foriegnKey:ConditionID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`
}
