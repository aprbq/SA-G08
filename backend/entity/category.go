package entity

import "gorm.io/gorm"

type Category struct {
   gorm.Model
   Category string `json:"category"`

   Menu []Menu `gorm:"foreignKey:CategoryID"`
}