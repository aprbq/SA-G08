package entity

import (
	"time"

	"gorm.io/gorm"
)

type Promotion struct {
	gorm.Model
	PromotionName string `json:"promotion_name"`
	Description   string `json:"description"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
	PointsAdded   int `json:"points_added"`
	PointsUse     int `json:"points_use"`
	DiscountValue float32 `json:"discount_value"`
	DiscountType  string `json:"discount_type"`
	Status        string `json:"status"`

	PointsTransactions []PointsTransactions `gorm:"foreignKey:PromotionID"`

	Order []Order `gorm:"foreignKey:PromotionID"`

	ConditionID *uint `json:"condition_id"`
	Condition   Condition `gorm:"foriegnKey:ConditionID" json: "condition"`

	EmployeeID *uint `json:"employee_id"`
	Employee   Employee `gorm:"foriegnKey:EmployeeID" json: "employee"`
}
