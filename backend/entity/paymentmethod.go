package entity

import (
	

	"gorm.io/gorm"
)

type Paymentmethod struct {
	gorm.Model
	PaymentMethods 		string    	`json:"payment_method"`
	

	Order []Order `gorm:"foreignKey:PaymentmethodID"`
}
