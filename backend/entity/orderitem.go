package entity

import "gorm.io/gorm"

type OrderItem struct {
	gorm.Model
	Quantity  int
	TotalItem float32
	

	
	OrderID *uint
	Order   Order `gorm:"foriegnKey:OrderID"`

	OrderHasMenu []OrderHasMenu `gorm:"foreignKey:OrderItemID"`
}