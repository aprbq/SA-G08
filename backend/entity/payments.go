package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payments struct {
	gorm.Model
	PaymentDate time.Time
	PaymentAmount float32
	PaymentMethod string

	Order []Order `gorm:"foreignKey:PaymentsID"`

	
}
