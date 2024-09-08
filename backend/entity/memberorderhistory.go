package entity

import (
	"time"
	"gorm.io/gorm"
)

type MemberOrderHistory struct {
	gorm.Model
	PointsTransition int	`json:"points_transition"`
	HistoryDate  time.Time	`json:"historydate"`
	Spending float32		`json:"spending"`
	// MemberID *uint
	// Member   Member `gorm:"foreignKey:MemberID"`

	MemberID 	uint		`json:"member_id"`
	Member    	*Member   	`gorm:"foreignKey: MemberID" json:"member"`

	OrderID  	uint		`json:"order_id"`
	Order    	*Order   	`gorm:"foreignKey:OrderID" json: "order"`
}