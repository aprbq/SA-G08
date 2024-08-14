package entity

import "gorm.io/gorm"

type OrderHasMenu struct {
	gorm.Model
	
	

	
	OrderitemID *uint
	OrderItem   OrderItem `gorm:"foriegnKey:OrderItemID"`

	MenuID *uint
	Menu   Menu `gorm:"foriegnKey:MenuID"`

	
}