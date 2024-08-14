package entity

import (
	"time"
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	OrderDate time.Time
	
	

	PaymentsID *uint
	Payments   Payments `gorm:"foriegnKey:PaymentsID"`

	PromotionID *uint
	Promotion   Promotion `gorm:"foriegnKey:PromotionID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`
	
}