package entity

import (
	"time"
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	OrderDate time.Time
	
	

	PaymentID *uint
	Payments   Payments `gorm:"foriegnKey:PaymentID"`

	PromotionID *uint
	Promotion   Promotion `gorm:"foriegnKey:PromotionID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`

	//Promotion []Promotion `gorm:"foreignKey:OrderID"`
	
}