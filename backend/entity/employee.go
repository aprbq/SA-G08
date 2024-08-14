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
	Role string

}