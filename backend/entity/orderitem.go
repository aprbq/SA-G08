package entity

import (
	

	"gorm.io/gorm"
)

type Orderitem struct {
	gorm.Model
	
	Quantity  	float32    	`json:"order_quantity"`
	
	TotalItem  	float32     `json:"total_item"`
	

	 OrdersweetID  	uint		`json:"ordersweet_id"`
	 Ordersweet    	*Ordersweet   	`gorm:"foreignKey:OrdersweetID" json:"ordersweet"`
	
	 OrderID  	uint		`json:"order_id"`
	 Order    	*Order   	`gorm:"foreignKey:OrderID" json:"order"`

	
	OrderHasMenu []OrderHasMenu `gorm:"foreignKey:OrderitemID"`
	
}