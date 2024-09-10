package entity

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	OrderDate  	time.Time 	`json:"order_date"` 

	PaymentID  	uint		`json:"payment_id"`
	Payment    	*Payment   	`gorm:"foreignKey:PaymentID" json:"payment"`

	UsersID uint      `json:"user_id"`
	Users   *Users `gorm:"foreignKey:UsersID" json:"users"`

	PromotionID 	uint		`json:"promotion_id"`
	Promotion    	*Promotion   	`gorm:"foreignKey: PromotionID" json:"promotion"`

	// MemberID 	uint		`json:"member_id"`
	// Member    	*Member   	`gorm:"foreignKey: MemberID" json:"member"`

	Orderitem []Orderitem `gorm:"foreignKey:OrderID"`

	MemberOrderHistory []MemberOrderHistory `gorm:"foreignKey:OrderID"`
}