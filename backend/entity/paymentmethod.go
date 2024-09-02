package entity

import (
	

	"gorm.io/gorm"
)

type Paymentmethod struct {
	gorm.Model
	PaymentMethod 		string    	`json:"payment_method"`
	

	Payment []Payment `gorm:"foreignKey:PaymentmethodID"`
}
