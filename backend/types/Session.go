package types

import (
	"api/dto"
	"context"
	"time"
)

type Session struct {
	Id          int       `json:"id"`
	IdUser      int       `json:"id_user"`
	Title       string    `json:"title"`
	Description string    `json:"desc"`
	Place       string    `json:"place"`
	Done        bool      `json:"done"`
	Date        time.Time `json:"date"`

	PatientsCount  int       `json:"patients_count"`
	UtiCount       int       `json:"uti_count"`
	MembersCount   int       `json:"members_count"`

	Patients       []Patient    `json:"patients"`
	Uti            []UtiPatient `json:"utis"`
	Members        []User       `json:"members"`
}

type ISessionRepository interface {
	FindAll(c context.Context) ([]Session, error)
	GetById(c context.Context, id int, includes bool) (Session, error)
	Create(c context.Context, item Session) (Session, error)
	Update(c context.Context, item Session) error
	Delete(c context.Context, id int) error

	UpdatePatients(c context.Context, id int, patients []int) error
	UpdateUtis(c context.Context,id int, patients []int) error
	UpdateMembers(c context.Context, id int, members []int) error
	GetPatientsById(c context.Context, id int) ([]Patient, error)
	GetUtiById(c context.Context, id int) ([]UtiPatient, error)
}

type ISessionService interface {
	FindAll(c context.Context) ([]Session, error)
	GetById(c context.Context, id int) (Session, error)
	Create(c context.Context, item dto.CreateSessiontDTO) (Session, error)
	Update(c context.Context, id int, item dto.CreateSessiontDTO) error
	Delete(c context.Context, id int) error	
	Finish(c context.Context, id int) error
}