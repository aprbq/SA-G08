package entity

import "gorm.io/gorm"

type Orderitem struct {
	gorm.Model
	quantity  int
	total_item float32
	

	
	OrderID *uint
	Order   Order `gorm:"foriegnKey:OrderID"`

	
}