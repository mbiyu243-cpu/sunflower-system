package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"sunflower-system/backend/internal/config"
	"sunflower-system/backend/internal/handlers"
	"sunflower-system/backend/internal/models"
)

func main() {
	config.ConnectDB()

	err := config.DB.AutoMigrate(
	&models.Farmer{},
	&models.SeedAllocation{},
	&models.User{},
)
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Sunflower Farmers API Running",
		})
	})

	r.POST("/farmers", handlers.CreateFarmer)
	r.GET("/farmers", handlers.GetFarmers)
	r.GET("/farmers/status/check", handlers.CheckFarmerStatus)
	r.GET("/farmers/:id", handlers.GetFarmer)
	r.PUT("/farmers/:id", handlers.UpdateFarmer)
	r.PUT("/farmers/:id/submit-mpesa-code", handlers.SubmitMpesaCode)
	r.PUT("/farmers/:id/payment", handlers.UpdatePaymentStatus)
	r.PUT("/farmers/:id/verify", handlers.VerifyFarmer)
	r.PUT("/farmers/:id/reject", handlers.RejectFarmer)
	r.PUT("/farmers/:id/simulate-payment", handlers.SimulateMpesaPayment)

	r.POST("/seed-allocations", handlers.CreateSeedAllocation)
	r.GET("/seed-allocations", handlers.GetSeedAllocations)
	r.PUT("/seed-allocations/:id/collect", handlers.MarkSeedCollected)

	r.GET("/dashboard/stats", handlers.GetDashboardStats)

	r.POST("/register-admin", handlers.RegisterAdmin)
	r.POST("/login", handlers.Login)
	r.PUT("/forgot-password", handlers.ForgotPassword)
	r.PUT("/admin/change-password", handlers.ChangeAdminPassword)

	r.GET("/farmer-dashboard/:id", handlers.GetFarmerDashboard)

	r.Run(":8080")
}