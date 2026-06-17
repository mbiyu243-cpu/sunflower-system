package handlers

import (
	"net/http"

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

func MarkSeedCollected(c *gin.Context) {
	id := c.Param("id")

	var allocation models.SeedAllocation

	if err := config.DB.First(&allocation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Seed allocation not found",
		})
		return
	}

	allocation.CollectionStatus = "Collected"

	config.DB.Save(&allocation)

	c.JSON(http.StatusOK, allocation)
}