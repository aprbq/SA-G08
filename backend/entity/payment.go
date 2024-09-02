package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	
	PaymentAmount  	float32     `json:"payment_amount"`
	
	PaymentDate  	time.Time 	`json:"payment_date"` 

	PaymentmethodID  	uint		`json:"paymentmethod_id"`
	Paymentmethod    	*Paymentmethod   	`gorm:"foreignKey:PaymentmethodID" json: "paymentmethod"`

	
}
