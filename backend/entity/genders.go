package entity

import "gorm.io/gorm"

type Genders struct {
   gorm.Model
   Gender string `json:"gender"`

   Employee []Employee `gorm:"foreignKey:GenderID"`
   Member []Member `gorm:"foreignKey:GendersID"`
}