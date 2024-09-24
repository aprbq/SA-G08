package entity

import (
	"time"
	"gorm.io/gorm"
)

type PointsTransactions struct {
	gorm.Model
	TransactionstDate time.Time
	PointsUsed int
	PointsAdd int
	Description string
	MemberID *uint
	Member   Member `gorm:"foreignKey:MemberID"`
	PromotionID *uint
	Promotion   Promotion `gorm:"foreignKey:PromotionID"`
	OrderID *uint
	Order   Promotion `gorm:"foreignKey:OrderID"`

}