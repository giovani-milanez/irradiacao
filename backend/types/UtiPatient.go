package types

import (
	"api/dto"
	"context"
	"time"

	"github.com/guregu/null/v5"
)

type UtiPatient struct {
	ID           int         `db:"id" json:"id"`
	UserID       int         `db:"id_user" json:"user_id"`
	Name         string      `db:"name" json:"name"`
	Birthday     null.Time   `db:"birthday" json:"birthday"`
	Description  null.String `db:"description" json:"description"`
	Created      time.Time   `db:"created" json:"created"`
	Deleted      bool        `db:"deleted" json:"deleted"`
	SessionCount int         `json:"session_count"`
	LastSession  null.Time   `json:"last_session"`
	// queue
	Position     null.Int32  `json:"position"`
	Joined       null.Time   `json:"joined"`
	QueueSize    int         `json:"queue_size"`

	// user
	UserName   null.String `json:"user_name"`
	UserEmail  null.String `json:"user_email"`
	UserAvatar null.String `json:"user_avatar"`
}

type QueueInfo struct {
	Size    int         `json:"queue_size"`
}

type IUtiPatientService interface {
	FindAll(c context.Context) ([]UtiPatient, error)
	FindInQueue(c context.Context) ([]UtiPatient, error)
	FindByUser(c context.Context) ([]UtiPatient, error)
	GetById(c context.Context, id int) (UtiPatient, error)
	Create(c context.Context, utiPatient dto.CreateUtiPatientDTO) (UtiPatient, error)
	Update(c context.Context, utiPatient dto.UpdateUtiPatientDTO) error
	Delete(c context.Context, id int) error
	JoinQueue(c context.Context, id int) error
	LeaveQueue(c context.Context, id int, reorderPositions bool) error
	GetQueueInfo(c context.Context) (QueueInfo, error)
}

type IUtiPatientRepository interface {
	FindAll(c context.Context) ([]UtiPatient, error)
	FindByName(c context.Context, name string, partial bool) ([]UtiPatient, error)
	// FindByNameAndUser(c context.Context, userId int, name string) ([]UtiPatient, error)
	FindInQueue(c context.Context) ([]UtiPatient, error)
	FindByUser(c context.Context, userId int) ([]UtiPatient, error)
	FindBySession(c context.Context, sessionId int) ([]UtiPatient, error)
	GetById(c context.Context, id int, includes bool) (UtiPatient, error)
	Create(c context.Context, utiPatient UtiPatient) (UtiPatient, error)
	Update(c context.Context, utiPatient UtiPatient) error
	Delete(c context.Context, id int) error	
}

type IUtiQueueRepository interface {
	JoinQueue(c context.Context, idUti int) error
	LeaveQueue(c context.Context, idUti int) error
	IsInQueue(c context.Context, idUti int) (bool, error)
	QueueSize(c context.Context) (int, error)
	FixupQueuePositions(c context.Context) error
	GetQueueInfo(c context.Context) (QueueInfo, error)
}