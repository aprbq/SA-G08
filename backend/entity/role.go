package entity

import (
	"gorm.io/gorm"
)

type Role struct {
	gorm.Model
	RoleName string      `json:"role_name"`

	Employee  []Employee `gorm:"foreignKey:RoleID"`
}
