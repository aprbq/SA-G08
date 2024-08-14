package entity

import (
	"time"

	"gorm.io/gorm"
)

type Ingredients struct {
	gorm.Model
	Name 		string    	`json:"name"`
	Quantity  	float32    	`json:"quantity"`
	Unit     	string    	`json:"unit"`
	UnitPrice  	float32     `json:"unit_price"`
	Price  		float32    	`json:"price"`
	Supplier  	string 	  	`json:"supplier"`
	ExpDate  	time.Time 	`json:"exp_date"` 

	ClassID  	uint     	
	Class    	*Class   	`gorm:"foreignKey: ClassID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`
}