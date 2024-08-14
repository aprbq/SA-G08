package entity

import (

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	Username string
	Password string
	Email string
	FirstName string
	LastName string
	Gender string
	Role string

	Member []Member `gorm:"foreignKey:EmployeeID"`
	Promotion []Promotion `gorm:"foreignKey:EmployeeID"`
	Order []Order `gorm:"foreignKey:EmployeeID"`
	Menu []Menu `gorm:"foreignKey:EmployeeID"`
	Ingredients []Ingredients `gorm:"foreignKey:EmployeeID"`

}