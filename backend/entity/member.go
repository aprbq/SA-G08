package entity

import (
	"time"
	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	FristName string
	LastName string
	Email string
	PhoneNumber string
	DateOfBirth time.Time
	Gender string
	StartDate time.Time
	EndtDate time.Time
	Points int
	Status string

	PointsTransactions []PointsTransactions `gorm:"foreignKey:MemberID"`
	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`

	Order []Order `gorm:"foreignKey:MemberID"`
}