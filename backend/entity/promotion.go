package entity

import (
	"time"

	"gorm.io/gorm"
)

type Promotion struct {
	gorm.Model
	PromotionName string    `json:"promotion_name"`
	Description   string    `json:"description"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
	PointsAdded   int       `json:"points_added"`
	PointsUse     int       `json:"points_use"`
	DiscountValue float32   `json:"discount_value"`

	Order []Order `gorm:"foreignKey:PromotionID"`
	Condition []Condition `gorm:"foreignKey:PromotionID"`
	PointsTransactions []PointsTransactions `gorm:"foreignKey:PromotionID"`

	DiscountTypeID uint          `json:"discount_type_id"`
	DiscountType   DiscountType `gorm:"foreignKey:DiscountTypeID" json: "discount_type"`

	PromotionTypeID uint           `json:"promotion_type_id"`
	PromotionType   PromotionType `gorm:"foreignKey:PromotionTypeID" json: "promotion_type"`

	StatusID uint    `json:"status_id"`
	Status   Status `gorm:"foreignKey:StatusID" json: "status"`

	EmployeeID uint      `json:"employee_id"`
	Employee   Employee `gorm:"foreignKey:EmployeeID" json: "employee"`
}
