package main

import (
	"example.com/sa-67-example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("SA-G08.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&entity.Promotion{}, &entity.Employee{}, &entity.Condition{}, &entity.Class{}, &entity.Ingredients{})
}
