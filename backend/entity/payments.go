package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payments struct {
	gorm.Model
	Payment_Date time.Time
	Payment_Amount float32
	Payment_Method string

	Order []Order `gorm:"foreignKey:PaymentID"`

	
}
