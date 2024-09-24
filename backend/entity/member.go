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
	StartDate time.Time			`json:"start_date"`
	EndDate time.Time			`json:"end_date"`
	Points int					`json:"points"`
	//PointsTransactions []PointsTransactions `gorm:"foreignKey:MemberID"`
	
	EmployeeID uint      `json:"employee_id"`
	Employee   Employee `gorm:"foreignKey:EmployeeID" json: "employee"`
	// Order []Order `gorm:"foreignKey:MemberID"`

	StatusID uint    `json:"status_id"`
	Status   Status `gorm:"foreignKey:StatusID" json: "status"`

	GenderID uint    `json:"gender_id"`
	Gender   Gender `gorm:"foreignKey:GenderID" json: "gender"`
	
	//MemberOrderHistory []MemberOrderHistory `gorm:"foreignKey:MemberID"`

	Order []Order `gorm:"foreignKey:MemberID"`

}