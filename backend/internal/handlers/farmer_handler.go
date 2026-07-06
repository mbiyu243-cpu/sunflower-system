package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"sunflower-system/backend/internal/config"
	"sunflower-system/backend/internal/models"
)

func CreateFarmer(c *gin.Context) {
	var input struct {
		Name            string  `json:"name"`
		IDNumber        string  `json:"id_number"`
		Contact         string  `json:"contact"`
		Location        string  `json:"location"`
		Age             int     `json:"age"`
		FarmSize        float64 `json:"farm_size"`
		RegistrationFee float64 `json:"registration_fee"`
		PaymentStatus   string  `json:"payment_status"`

		PaymentMethod         string `json:"payment_method"`
        CryptoNetwork         string `json:"crypto_network"`
        CryptoWalletAddress   string `json:"crypto_wallet_address"`
        CryptoTransactionHash string `json:"crypto_transaction_hash"`

		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	farmer := models.Farmer{
    Name:                  input.Name,
    IDNumber:              input.IDNumber,
    Contact:               input.Contact,
    Location:              input.Location,
    Age:                   input.Age,
    FarmSize:              input.FarmSize,
    RegistrationFee:       input.RegistrationFee,
    PaymentStatus:         input.PaymentStatus,
    PaybillNumber:         "123456",
    AccountNumber:         input.IDNumber,

    PaymentMethod:         input.PaymentMethod,
    CryptoNetwork:         input.CryptoNetwork,
    CryptoWalletAddress:   input.CryptoWalletAddress,
    CryptoTransactionHash: input.CryptoTransactionHash,

    CryptoPaymentStatus: func() string {
        if input.PaymentMethod == "Crypto" {
            return "Pending Confirmation"
        }
        return ""
    }(),
}

	config.DB.Create(&farmer)

	if input.Email != "" && input.Password != "" {
		hashedPassword, _ := bcrypt.GenerateFromPassword(
			[]byte(input.Password),
			bcrypt.DefaultCost,
		)

		user := models.User{
			Name:     input.Name,
			Email:    input.Email,
			Phone:    input.Contact,
			Password: string(hashedPassword),
			Role:     "farmer",
			FarmerID: &farmer.ID,
		}

		config.DB.Create(&user)
	}

	c.JSON(http.StatusCreated, farmer)
}

func GetFarmers(c *gin.Context) {
	var farmers []models.Farmer

	config.DB.Find(&farmers)

	c.JSON(http.StatusOK, farmers)
}

func GetFarmer(c *gin.Context) {
	id := c.Param("id")

	var farmer models.Farmer

	result := config.DB.First(&farmer, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	c.JSON(http.StatusOK, farmer)
}

func UpdatePaymentStatus(c *gin.Context) {
	id := c.Param("id")

	var farmer models.Farmer

	if err := config.DB.First(&farmer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	var request struct {
		PaymentStatus string `json:"payment_status"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	farmer.PaymentStatus = request.PaymentStatus

if farmer.PaymentMethod == "Crypto" && request.PaymentStatus == "Paid" {
	farmer.CryptoPaymentStatus = "Approved"
	farmer.VerificationStatus = "Verified"
}

	config.DB.Save(&farmer)

	c.JSON(http.StatusOK, farmer)
}

func VerifyFarmer(c *gin.Context) {
	id := c.Param("id")

	var farmer models.Farmer

	if err := config.DB.First(&farmer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	if farmer.PaymentStatus != "Paid" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Farmer must pay registration fee before verification",
		})
		return
	}

	farmer.VerificationStatus = "Verified"

	config.DB.Save(&farmer)

	c.JSON(http.StatusOK, farmer)
}

func SubmitMpesaCode(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		MpesaCode string `json:"mpesa_code"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var farmer models.Farmer

	if err := config.DB.First(&farmer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Farmer not found"})
		return
	}

	farmer.SubmittedMpesaCode = input.MpesaCode
	farmer.PaymentStatus = "Pending Confirmation"

	config.DB.Save(&farmer)

	c.JSON(http.StatusOK, farmer)
}

func SimulateMpesaPayment(c *gin.Context) {
	id := c.Param("id")

	var farmer models.Farmer

	if err := config.DB.First(&farmer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	farmer.PaymentStatus = "Paid"
	farmer.MpesaReceipt = "SIMULATED-MPESA-RECEIPT"
	farmer.TransactionID = "TXN-SIMULATED-001"

	config.DB.Save(&farmer)

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment received successfully",
		"farmer":  farmer,
	})
}

func CheckFarmerStatus(c *gin.Context) {
	idNumber := c.Query("id_number")
	contact := c.Query("contact")

	var farmer models.Farmer

	if err := config.DB.
		Where("id_number = ? AND contact = ?", idNumber, contact).
		First(&farmer).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	var allocation models.SeedAllocation

	seedStatus := "Pending"
	bagsAllocated := 0
	collectionStatus := "Pending"

	if err := config.DB.
		Where("farmer_id = ?", farmer.ID).
		First(&allocation).Error; err == nil {
		seedStatus = allocation.Status
		bagsAllocated = allocation.BagsAllocated
		collectionStatus = allocation.CollectionStatus
	}

	c.JSON(http.StatusOK, gin.H{
		"ID":                  farmer.ID,
		"name":                farmer.Name,
		"id_number":           farmer.IDNumber,
		"contact":             farmer.Contact,
		"location":            farmer.Location,
		"age":                 farmer.Age,
		"farm_size":           farmer.FarmSize,
		"registration_fee":    farmer.RegistrationFee,
		"paybill_number":      farmer.PaybillNumber,
        "account_number":      farmer.AccountNumber,
        "submitted_mpesa_code": farmer.SubmittedMpesaCode,
		"payment_status":      farmer.PaymentStatus,
		"verification_status": farmer.VerificationStatus,
		"mpesa_receipt":       farmer.MpesaReceipt,
		"transaction_id":      farmer.TransactionID,

		"seed_status":        seedStatus,
		"bags_allocated":     bagsAllocated,
		"collection_status":  collectionStatus,
		"payment_method":           farmer.PaymentMethod,
        "crypto_network":           farmer.CryptoNetwork,
        "crypto_wallet_address":    farmer.CryptoWalletAddress,
        "crypto_transaction_hash":  farmer.CryptoTransactionHash,
        "crypto_payment_status":    farmer.CryptoPaymentStatus,
	})
}

func GetFarmerDashboard(c *gin.Context) {
	id := c.Param("id")

	var farmer models.Farmer

	if err := config.DB.First(&farmer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	var allocation models.SeedAllocation

	seedStatus := "Pending"
	bagsAllocated := 0
	collectionStatus := "Pending"

	if err := config.DB.
		Where("farmer_id = ?", farmer.ID).
		First(&allocation).Error; err == nil {
		seedStatus = allocation.Status
		bagsAllocated = allocation.BagsAllocated
		collectionStatus = allocation.CollectionStatus
	}

	c.JSON(http.StatusOK, gin.H{
		"ID":                  farmer.ID,
		"name":                farmer.Name,
		"id_number":           farmer.IDNumber,
		"contact":             farmer.Contact,
		"location":            farmer.Location,
		"age":                 farmer.Age,
		"farm_size":           farmer.FarmSize,
		"registration_fee":    farmer.RegistrationFee,
		"paybill_number":      farmer.PaybillNumber,
        "account_number":      farmer.AccountNumber,
        "submitted_mpesa_code": farmer.SubmittedMpesaCode,
		"payment_status":      farmer.PaymentStatus,
		"verification_status": farmer.VerificationStatus,
		"mpesa_receipt":       farmer.MpesaReceipt,
		"transaction_id":      farmer.TransactionID,
		"seed_status":         seedStatus,
		"bags_allocated":      bagsAllocated,
		"allocation_id":       allocation.ID,
		"collection_status":   collectionStatus,
		"payment_method":      farmer.PaymentMethod,
        "crypto_network":      farmer.CryptoNetwork,
        "crypto_wallet_address":    farmer.CryptoWalletAddress,
        "crypto_transaction_hash":  farmer.CryptoTransactionHash,
        "crypto_payment_status":    farmer.CryptoPaymentStatus,
	})
}

func RejectFarmer(c *gin.Context) {
	id := c.Param("id")

	var farmer models.Farmer

	if err := config.DB.First(&farmer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	farmer.VerificationStatus = "Rejected"

	config.DB.Save(&farmer)

	c.JSON(http.StatusOK, farmer)
}

func UpdateFarmer(c *gin.Context) {
	id := c.Param("id")

	var farmer models.Farmer

	if err := config.DB.First(&farmer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Farmer not found",
		})
		return
	}

	var input struct {
		Name     string  `json:"name"`
		Contact  string  `json:"contact"`
		Location string  `json:"location"`
		Age      int     `json:"age"`
		FarmSize float64 `json:"farm_size"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	farmer.Name = input.Name
	farmer.Contact = input.Contact
	farmer.Location = input.Location
	farmer.Age = input.Age
	farmer.FarmSize = input.FarmSize

	config.DB.Save(&farmer)

	c.JSON(http.StatusOK, farmer)
}