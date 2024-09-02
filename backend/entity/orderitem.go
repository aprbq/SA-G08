package entity

import (
	"time"

	"gorm.io/gorm"
)

type Orderitem struct {
	gorm.Model
	
	Quantity  	float32    	`json:"order_quantity"`
	
	TotalItem  	float32     `json:"total_item"`
	

	OrderID  	uint		`json:"order_id"`
	Order    	*Order   	`gorm:"foreignKey:OrderID" json: "order"`

	
	OrderHasMenu []OrderHasMenu `gorm:"foreignKey:OrderitemID"`
}