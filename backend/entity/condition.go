package entity

import (
	"time"

	"gorm.io/gorm"
)

type Condition struct {
	gorm.Model
	ConditionName      string
	ConditionForDate   time.Time
	ConditionForMember string

	MenuID *uint
	Menu             Menu `gorm:"foriegnKey:MenuID"`
}
