package entity

import "gorm.io/gorm"

type Class struct {
   gorm.Model
   Class string `json:"class"`

   Ingredients []Ingredients `gorm:"foreignKey:ClassID"`
}