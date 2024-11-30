package service

import (
	"api/dto"
	"api/types"
	"context"

	// "database/sql"

	// "errors"
	"time"

	"github.com/guregu/null/v5"
)

var validity_days       time.Duration = time.Hour * 24 * 30
var validity_trial_days time.Duration = time.Hour * 24 * 7

type PatientService struct {
	repo types.IPatientRepository
}

func NewPatientService(repo types.IPatientRepository) *PatientService {
	return &PatientService{ repo: repo }
}

func (ps *PatientService) FindAll(c context.Context) ([]types.Patient, error) {
	u, ok := types.FromUserContext(c)
	if !ok {
		return nil, types.ErrUnauhtorized
	}
	if u.Admin {
		return ps.repo.FindAll(c)
	} else {
		return ps.FindByUser(c, u.Id)
	}
}
func (ps *PatientService) FindByUser(c context.Context, userId int) ([]types.Patient, error) {
	return ps.repo.FindByUser(c, userId)
}
func (ps *PatientService) FindByName(c context.Context, name string, partial bool) ([]types.Patient, error) {
	return ps.repo.FindByName(c, name, partial)
}
func (ps *PatientService) FindByNameAndUser(c context.Context, userId int, name string) ([]types.Patient, error) {
	return ps.repo.FindByNameAndUser(c, userId, name)
}
func (ps *PatientService) FindAllValids(c context.Context) ([]types.Patient, error) {
	return ps.repo.FindAllValids(c)
}
func (ps *PatientService) GetById(c context.Context, id int) (types.Patient, error) {
	return ps.repo.GetById(c, id, true)
}
func (ps *PatientService) Create(c context.Context, dto dto.CreatePatientDTO) (types.Patient, error) {
	u, ok := types.FromUserContext(c)
	patient := types.Patient{ Name: dto.Name, Validity: time.Now().Add(validity_days).UTC(), Created: time.Now().UTC(), Deleted: false }
	if !ok {
		patient.Validity = time.Now().Add(validity_trial_days).UTC()		
		patient.IdUser = null.Int32{}
	} else {
		patient.IdUser = null.Int32From(int32(u.Id))
	}
	names, err := ps.repo.FindByName(c, dto.Name, false)
	if err != nil {
		return types.Patient{}, err
	}
	if len(names) != 0 {
		return types.Patient{}, types.ErrAlreadyExists
	}
	return ps.repo.Create(c, patient)
}
func (ps *PatientService) Update(c context.Context, patient types.Patient) error {
	return ps.repo.Update(c, patient)
}
func (ps *PatientService) Delete(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok { return types.ErrUnauhtorized }

	p, err := ps.repo.GetById(c, id, false)
	if err != nil { return err }
	if !p.IdUser.Valid {
		if !u.Admin {
			return types.ErrUnauhtorized
		}
	} else if int(p.IdUser.Int32) != u.Id && !u.Admin {
		return types.ErrUnauhtorized
	}
	
	return ps.repo.Delete(c, id)
}

func (ps *PatientService) Renew(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok { return types.ErrUnauhtorized }

	p, err := ps.repo.GetById(c, id, false)
	if err != nil { return err }
	if !p.IdUser.Valid {
		if !u.Admin {
			return types.ErrUnauhtorized
		}
	} else if int(p.IdUser.Int32) != u.Id && !u.Admin {
		return types.ErrUnauhtorized
	}
	if !p.Expired {
		return types.ErrValidation
	}
	p.Validity = time.Now().Add(validity_days).UTC()
	return ps.repo.Update(c, p)
}