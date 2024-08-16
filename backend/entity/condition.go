package entity

import (
	"time"

	"gorm.io/gorm"
)

type Condition struct {
	gorm.Model
	ConditionName      string `json:"condition_name"`
	ConditionForDate   time.Time `json:"condition_for_date"`
	ConditionForMember string `json:"condition_for_member"`

	MenuID *uint	`json:"menu_id"`
	Menu    Menu 	`gorm:"foriegnKey:MenuID" json:"menu`
}
