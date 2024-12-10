package types

import (
	"api/dto"
	"context"
	"time"
	"github.com/guregu/null/v5"
)

type Patient struct {
	Id       int           `json:"id"`
	IdUser   null.Int32    `json:"id_user"`
	Name     string        `json:"name"`
	Validity time.Time     `json:"validity"`
	Created  time.Time     `json:"created"`
	Deleted  bool          `json:"deleted"`
	Expired  bool          `json:"expired"`
	SessionCount int       `json:"session_count"`
	LastSession null.Time  `json:"last_session"`	

	UserName   null.String `json:"user_name"`
	UserEmail  null.String `json:"user_email"`
	UserAvatar null.String `json:"user_avatar"`
}

type IPatientService interface {
	FindAll(c context.Context) ([]Patient, error)
	FindByUser(c context.Context) ([]Patient, error)
	FindByName(c context.Context, name string, partial bool) ([]Patient, error)
	FindByNameAndUser(c context.Context, userId int, name string) ([]Patient, error)
	FindAllValids(c context.Context) ([]Patient, error)
	GetById(c context.Context, id int) (Patient, error)
	Create(c context.Context, patient dto.CreatePatientDTO) (Patient, error)
	Update(c context.Context, patient Patient) error
	Delete(c context.Context, id int) error
	Renew(c context.Context, id int) error
}

type IPatientRepository interface {
	FindAll(c context.Context) ([]Patient, error)
	FindByName(c context.Context, name string, partial bool) ([]Patient, error)
	FindByNameAndUser(c context.Context, userId int, name string) ([]Patient, error)
	FindAllValids(c context.Context) ([]Patient, error)
	FindByUser(c context.Context, userId int) ([]Patient, error)
	FindBySession(c context.Context, sessionId int) ([]Patient, error)
	GetById(c context.Context, id int, includes bool) (Patient, error)
	Create(c context.Context, patient Patient) (Patient, error)
	Update(c context.Context, patient Patient) error
	Delete(c context.Context, id int) error
}