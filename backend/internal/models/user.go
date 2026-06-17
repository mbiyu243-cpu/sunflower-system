package models

import "gorm.io/gorm"

type User struct {
	gorm.Model

	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique"`
	Phone    string `json:"phone"`
	Password string `json:"-"`
	Role     string `json:"role"` // admin or farmer
	FarmerID *uint  `json:"farmer_id"`
}