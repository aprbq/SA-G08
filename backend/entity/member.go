package entity

import (
	"time"
	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	FristName string			`json:"frist_name"`
	LastName string				`json:"last_name"`
	Email string				`json:"email"`
	PhoneNumber string			`json:"phone_number"`
	DateOfBirth time.Time		`json:"date_of_birth"`
	Gender string				`json:"gender"`
	StartDate time.Time			`json:"start_date"`
	EndDate time.Time			`json:"end_date"`
	Points int					`json:"points"`
	Status string				`json:"status"`
	//PointsTransactions []PointsTransactions `gorm:"foreignKey:MemberID"`
	UsersID *uint
	Users   Users `gorm:"foreignKey:UsersID"`
	Order []Order `gorm:"foreignKey:MemberID"`
	MemberOrderHistory []MemberOrderHistory `gorm:"foreignKey:MemberID"`
}