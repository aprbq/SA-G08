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
	db.AutoMigrate(&entity.Employee{}, &entity.Class{}, &entity.Category{},
		&entity.Payments{}, &entity.Member{}, &entity.Menu{},&entity.Ingredients{},
		&entity.MenuIngredient{}, &entity.Order{}, &entity.OrderItem{},
		&entity.OrderHasMenu{}, &entity.Condition{}, &entity.Promotion{},
		&entity.PointsTransactions{})
}
