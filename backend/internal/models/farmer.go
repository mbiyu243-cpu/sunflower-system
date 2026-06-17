package models

import "gorm.io/gorm"

type Farmer struct {
	gorm.Model

	Name               string  `json:"name"`
	IDNumber           string  `json:"id_number"`
	Contact            string  `json:"contact"`
	Location           string  `json:"location"`
	Age                int     `json:"age"`
	FarmSize           float64 `json:"farm_size"`
	RegistrationFee    float64 `json:"registration_fee"`
	
	PaybillNumber      string `json:"paybill_number"`
    AccountNumber      string `json:"account_number"`
    SubmittedMpesaCode string `json:"submitted_mpesa_code"`

	PaymentStatus      string  `json:"payment_status"`
	VerificationStatus string  `json:"verification_status"`

	MpesaReceipt       string  `json:"mpesa_receipt"`
	TransactionID      string  `json:"transaction_id"`
}