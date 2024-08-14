package entity

import "gorm.io/gorm"

type Order_item struct {
	gorm.Model
	quantity  int
	total_item float32
	

	
	OrderID *uint
	Order   Order `gorm:"foriegnKey:OrderID"`

	
}