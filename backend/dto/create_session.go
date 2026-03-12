package dto

import "time"

type CreateSessiontDTO struct {
	Title    string    `json:"title"`
	Desc     string    `json:"desc"`
	Place    string    `json:"place"`
	PlaceImg []byte    `json:"place_img"`
	Date     time.Time `json:"date"`

	PatientIds []int `json:"patient_ids"`
	UtiIds []int `json:"uti_ids"`
}
