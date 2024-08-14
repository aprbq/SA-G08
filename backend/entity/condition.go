package entity

import (
	"time"

	"gorm.io/gorm"
)

type Condition struct {
	gorm.Model
	ConditionName      string
	ConditionForDate   time.Time
	ConditionForMember time.Time

	ConditionForMenu *uint
	Menu             Menu `gorm:"foriegnKey:ConditionForMenu"`
}
