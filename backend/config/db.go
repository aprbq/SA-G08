package config

import (
	"fmt"
	"time"

	"example.com/sa-67-example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.Genders{},
		&entity.Class{},
		&entity.Users{},
		&entity.Ingredients{},
		&entity.Menu{},
		&entity.Category{},
		&entity.MenuIngredient{},
	)

	GenderMale := entity.Genders{Gender: "Male"}
	GenderFemale := entity.Genders{Gender: "Female"}

	ClassMilk := entity.Class{Class: "Milk"}
	ClassTea := entity.Class{Class: "Tea"}
	ClassCoffee := entity.Class{Class: "Coffee"}
	ClassSyrups := entity.Class{Class: "Syrups"}

	CategoryHot := entity.Category{Category: "Hot"}
	CategoryIce := entity.Category{Category: "Ice"}
	CategoryFrappe:= entity.Category{Category: "Frappe"}

	db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})

	db.FirstOrCreate(&ClassMilk, &entity.Class{Class: "Milk"})
	db.FirstOrCreate(&ClassTea, &entity.Class{Class: "Tea"})
	db.FirstOrCreate(&ClassCoffee, &entity.Class{Class: "Coffee"})
	db.FirstOrCreate(&ClassSyrups, &entity.Class{Class: "Syrups"})

	db.FirstOrCreate(&CategoryHot, &entity.Category{Category: "Hot"})
	db.FirstOrCreate(&CategoryIce, &entity.Category{Category: "Ice"})
	db.FirstOrCreate(&CategoryFrappe, &entity.Category{Category: "Frappe"})

	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")
	User := &entity.Users{
		FirstName: "Software",
		LastName:  "Analysis",
		Email:     "sa@gmail.com",
		Age:       80,
		Password:  hashedPassword,
		BirthDay:  BirthDay,
		GenderID:  1,
		Address:   "Korat",
	}
	db.FirstOrCreate(User, &entity.Users{
		Email: "sa@gmail.com",
	})

	exp_date, err := time.Parse("2006-01-02", "2024-08-14")
	if err != nil {
		fmt.Println("Error parsing date:", err)
	}

	Ingre := &entity.Ingredients{
		Name: "Nom",
		Quantity:  10,
		Unit:     "kilogram",
		UnitPrice:   80,
		Price:  800,
		Supplier:  "mild",
		ExpDate:  exp_date,
		ClassID:  1,
		UsersID:  1,
	}
	db.FirstOrCreate(Ingre, &entity.Ingredients{
		Name: "Nom",
	})

	Menu := &entity.Menu{
		Name: "Espresso",
		Description:  "ajh",
		Price:  45,
		CategoryID: 1,
		MenuIngredientID: 1,
		UsersID: 1,
	}
	db.FirstOrCreate(Menu, &entity.Menu{
		Name: "Espresso",
	})
}
