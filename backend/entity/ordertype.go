package entity

import (
	

	"gorm.io/gorm"
)

type Ordertype struct {
	gorm.Model
	OrderTypes 		string    	`json:"order_type_name"`
	

	Orderitem []Orderitem `gorm:"foreignKey:OrdertypeID"`
}
