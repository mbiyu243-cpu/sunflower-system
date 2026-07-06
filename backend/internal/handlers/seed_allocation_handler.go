package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"sunflower-system/backend/internal/config"
	"sunflower-system/backend/internal/models"
)

func CreateSeedAllocation(c *gin.Context) {
	var allocation models.SeedAllocation

	if err := c.ShouldBindJSON(&allocation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var farmer models.Farmer

	if err := config.DB.First(&farmer, allocation.FarmerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Farmer not found"})
		return
	}

	if farmer.PaymentStatus != "Paid" || farmer.VerificationStatus != "Verified" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Farmer must be paid and verified before seed allocation"})
		return
	}

	allocation.Status = "Allocated"

    if allocation.CollectionStatus == "" {
	   allocation.CollectionStatus = "Pending"
    }

	config.DB.Create(&allocation)

	c.JSON(http.StatusCreated, allocation)
}

func GetSeedAllocations(c *gin.Context) {
	var allocations []models.SeedAllocation

	config.DB.Find(&allocations)

	c.JSON(http.StatusOK, allocations)
}

func GetSeedAllocationDetails(c *gin.Context) {
	id := c.Param("id")

	var allocation models.SeedAllocation

	if err := config.DB.First(&allocation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Seed allocation not found",
		})
		return
	}

	var farmer models.Farmer

	if err := config.DB.First(&farmer, allocation.FarmerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"allocation_id":      allocation.ID,
		"farmer_id":          farmer.ID,
		"name":               farmer.Name,
		"id_number":          farmer.IDNumber,
		"contact":            farmer.Contact,
		"location":           farmer.Location,
		"payment_status":     farmer.PaymentStatus,
		"verification_status": farmer.VerificationStatus,
		"bags_allocated":     allocation.BagsAllocated,
		"collection_center":  allocation.CollectionCenter,
		"collection_date":    allocation.CollectionDate,
		"collection_status":  allocation.CollectionStatus,
        "collected_by":       allocation.CollectedBy,
        "collected_at":       allocation.CollectedAt,
        "seed_status":        allocation.Status,
	})
}

func MarkSeedCollected(c *gin.Context) {
	id := c.Param("id")

	var allocation models.SeedAllocation

	if err := config.DB.First(&allocation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Allocation not found",
		})
		return
	}

	if allocation.CollectionStatus == "Collected" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Seeds already collected",
		})
		return
	}

	allocation.CollectionStatus = "Collected"
	
	var input struct {
	CollectedBy string `json:"collected_by"`
    }

    c.ShouldBindJSON(&input)

    if input.CollectedBy == "" {
	    input.CollectedBy = "Unknown Officer"
    }

    allocation.CollectedBy = input.CollectedBy
    allocation.CollectedAt = time.Now().Format("2006-01-02 15:04:05")

	if err := config.DB.Save(&allocation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update collection status",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Seeds collected successfully",
	})
}