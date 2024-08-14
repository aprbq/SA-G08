package entity

import (

	"time"
	"gorm.io/gorm"
)

type Promotion struct {
	gorm.Model
	PromotionName string
	Description string
	StartDate time.Time
	End_Date time.Time
	PointsAdded int
	PointsUse int
	DiscountValue int
	DiscountType string
	Status string

	OrderID *uint
	Order   Order `gorm:"foriegnKey:OrderID"`

	ConditionID *uint
	Condition   Condition `gorm:"foriegnKey:ConditionID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`

}