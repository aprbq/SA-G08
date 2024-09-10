package entity

import (

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	Username string `json:"username"`
	Password string `json:"-"`
	Email string 	`json:"email"`
	FirstName string`json:"first_name"`
	LastName string	`json:"last_name"`	
	Role string		`json:"role"`

	GenderID  uint      `json:"gender_id"`
    Gender    *Genders  `gorm:"foreignKey: GenderID" json:"gender"`

	Promotion []Promotion `gorm:"foreignKey:EmployeeID"`


}