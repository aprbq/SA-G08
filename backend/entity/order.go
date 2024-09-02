package entity

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	OrderDate  	time.Time 	`json:"order_date"` 

	PaymentID  	uint		`json:"payment_id"`
	Payment    	*Payment   	`gorm:"foreignKey:PaymentID" json: "payment"`

	EmployeeID 	uint		`json:"employee_id"`
	Employee    	*Employee   	`gorm:"foreignKey: EmployeeID" json:"employee"`

	PromotionID 	uint		`json:"promotion_id"`
	Promotion    	*Promotion   	`gorm:"foreignKey: PromotionID" json:"promotion"`

	Orderitem []Orderitem `gorm:"foreignKey:OrderID"`
}