package entity

import "gorm.io/gorm"

type Genders struct {
   gorm.Model
   Gender string `json:"gender"`

   MemberID 	uint		`json:"member_id"`
	Member    	*Member   	`gorm:"foreignKey: MemberID" json:"member"`
}