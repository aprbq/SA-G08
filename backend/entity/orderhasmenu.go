package entity

import "gorm.io/gorm"

type OrderHasItem struct {
	gorm.Model
	
	

	
	OrderitemID *uint
	Orderitem   Orderitem `gorm:"foriegnKey:OrderitemID"`

	MenuID *uint
	Menu   Menu `gorm:"foriegnKey:MenuID"`

	
}