package models

import "gorm.io/gorm"

type SeedAllocation struct {
	gorm.Model

	FarmerID         uint   `json:"farmer_id"`
	BagsAllocated    int    `json:"bags_allocated"`
	Status           string `json:"status"`
	CollectionStatus string `json:"collection_status"`

	CollectedBy string `json:"collected_by"`
    CollectedAt string `json:"collected_at"`

	CollectionCenter string `json:"collection_center"`
	CollectionDate   string `json:"collection_date"`
}