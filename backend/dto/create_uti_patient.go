package dto

import "time"

type CreateUtiPatientDTO struct {
	Name        string    `json:"name"`
	Birthday    time.Time `json:"birthday"`
	Description string    `json:"description"`
}

type UpdateUtiPatientDTO struct {
	Id          int       `json:"id"`
	CreateUtiPatientDTO
}