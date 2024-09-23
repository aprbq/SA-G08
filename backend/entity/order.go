package entity

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	OrderDate  	time.Time 	`json:"order_date"`
	PaymentAmount float32 `json:"payment_amount"`
	PaymentAmountBefore float32 `json:"payment_amount_before"`

	EmployeeID uint      `json:"employee_id"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee"`

	PromotionID 	uint		`json:"promotion_id"`
	Promotion    	*Promotion   	`gorm:"foreignKey:PromotionID" json:"promotion"`

	PaymentmethodID 	uint		`json:"paymentmethod_id"`
	Paymentmethod    	*Paymentmethod   	`gorm:"foreignKey:PaymentmethodID" json:"paymentmethod"`

	Orderitem []Orderitem `gorm:"foreignKey:OrderID"`

	MemberOrderHistory []MemberOrderHistory `gorm:"foreignKey:OrderID"`
}