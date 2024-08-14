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
	description string
	MemberID *uint
	Member   Member `gorm:"foriegnKey:MemberID"`
	PromotionID *uint
	Promotion   Promotion `gorm:"foriegnKey:PromotionID"`

}