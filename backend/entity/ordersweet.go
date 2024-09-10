package entity

import (
	

	"gorm.io/gorm"
)

type Ordersweet struct {
	gorm.Model
	OrderSweets 		string    	`json:"order_sweet_name"`
	

	Orderitem []Orderitem `gorm:"foreignKey:OrdersweetID"`
}
