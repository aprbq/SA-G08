package entity

import "gorm.io/gorm"

type Gender struct {
   gorm.Model
   GenderName string `json:"gender_name"`

   Employee []Employee `gorm:"foreignKey:GenderID"`
   Member []Member `gorm:"foreignKey:GenderID"`
}