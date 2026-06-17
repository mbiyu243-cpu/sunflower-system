package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"sunflower-system/backend/internal/config"
	"sunflower-system/backend/internal/models"
)

func GetDashboardStats(c *gin.Context) {
	var totalFarmers int64
	var verifiedFarmers int64
	var pendingVerification int64
	var paidFarmers int64
	var unpaidFarmers int64
	var totalAllocations int64
	var totalRevenue float64

	var seedsAllocated int64
	var seedsCollected int64
	var pendingCollection int64

	config.DB.Model(&models.Farmer{}).Count(&totalFarmers)

	config.DB.Model(&models.Farmer{}).
		Where("verification_status = ?", "Verified").
		Count(&verifiedFarmers)

	config.DB.Model(&models.Farmer{}).
		Where("verification_status <> ? OR verification_status IS NULL", "Verified").
		Count(&pendingVerification)

	config.DB.Model(&models.Farmer{}).
		Where("payment_status = ?", "Paid").
		Count(&paidFarmers)

	config.DB.Model(&models.Farmer{}).
		Where("payment_status <> ? OR payment_status IS NULL", "Paid").
		Count(&unpaidFarmers)

	config.DB.Model(&models.SeedAllocation{}).
		Count(&totalAllocations)

	config.DB.Model(&models.Farmer{}).
		Where("payment_status = ?", "Paid").
		Select("COALESCE(SUM(registration_fee), 0)").
		Scan(&totalRevenue)

	config.DB.Model(&models.SeedAllocation{}).
		Select("COALESCE(SUM(bags_allocated), 0)").
		Scan(&seedsAllocated)

	config.DB.Model(&models.SeedAllocation{}).
		Where("collection_status = ?", "Collected").
		Select("COALESCE(SUM(bags_allocated), 0)").
		Scan(&seedsCollected)

	config.DB.Model(&models.SeedAllocation{}).
		Where("collection_status = ? OR collection_status IS NULL", "Pending").
		Count(&pendingCollection)

	c.JSON(http.StatusOK, gin.H{
		"total_farmers":        totalFarmers,
		"verified_farmers":     verifiedFarmers,
		"pending_verification": pendingVerification,
		"paid_farmers":         paidFarmers,
		"unpaid_farmers":       unpaidFarmers,
		"seed_allocations":     totalAllocations,
		"total_revenue":        totalRevenue,
		"seeds_allocated":      seedsAllocated,
		"seeds_collected":      seedsCollected,
		"pending_collection":   pendingCollection,
	})
}