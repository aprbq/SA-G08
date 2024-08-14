package entity

import (
	"time"
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	Order_Date time.Time
	
	

	PaymentID *uint
	Payments   Payments `gorm:"foriegnKey:Payment_ID"`

	PromotionID *uint
	Promotion   Promotion `gorm:"foriegnKey:PromotionID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`
	
}