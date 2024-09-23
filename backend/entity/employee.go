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
	PictureEmployee     string      `gorm:"type:longtext" json:"picture_employee"`	


	GenderID  uint      `json:"gender_id"`
    Gender    Gender  `gorm:"foreignKey: GenderID" json:"gender"`

	RoleID  uint      `json:"role_id"`
    Role    Role  `gorm:"foreignKey: RoleID" json:"role"`

	Promotion []Promotion `gorm:"foreignKey:EmployeeID"`
	Member []Member `gorm:"foreignKey:EmployeeID"`


}