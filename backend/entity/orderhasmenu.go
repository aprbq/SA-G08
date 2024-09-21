package entity

import "gorm.io/gorm"

type OrderHasMenu struct {
	gorm.Model


	// OrderitemID  	uint		`json:"orderitem_id"`
	// Orderitem    	*Orderitem   	`gorm:"foreignKey:OrderitemID" json:"orderitem"`

	// MenuID 	uint		`json:"menu_id"`
	// Menu    	*Menu   	`gorm:"foreignKey: MenuID" json:"menu"`
}
