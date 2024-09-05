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
	UsersID *uint
	Users   Users `gorm:"foreignKey:UsersID"`

	Order []Order `gorm:"foreignKey:MemberID"`
}