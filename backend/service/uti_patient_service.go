package service

import (
	"api/dto"
	"api/types"
	"context"
	"time"

	"github.com/guregu/null/v5"
)


type UtiPatientService struct {
	repo  types.IUtiPatientRepository
	qRepo types.IUtiQueueRepository
}

func NewUtiPatientService(repo types.IUtiPatientRepository, qRepo types.IUtiQueueRepository) *UtiPatientService {
	return &UtiPatientService{ repo: repo, qRepo: qRepo }
}

func (ps *UtiPatientService) FindAll(c context.Context) ([]types.UtiPatient, error) {
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
func (ps *UtiPatientService) FindInQueue(c context.Context) ([]types.UtiPatient, error) {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return nil, types.ErrUnauhtorized
	}
	return ps.repo.FindInQueue(c)
}
func (ps *UtiPatientService) FindByUser(c context.Context, userId int) ([]types.UtiPatient, error) {
	return ps.repo.FindByUser(c, userId)
}
func (ps *UtiPatientService) FindByName(c context.Context, name string, partial bool) ([]types.UtiPatient, error) {
	return ps.repo.FindByName(c, name, partial)
}
// func (ps *UtiPatientService) FindByNameAndUser(c context.Context, userId int, name string) ([]types.UtiPatient, error) {
// 	return ps.repo.FindByNameAndUser(c, userId, name)
// }
// func (ps *UtiPatientService) FindAllValids(c context.Context) ([]types.UtiPatient, error) {
// 	return ps.repo.FindAllValids(c)
// }
func (ps *UtiPatientService) GetById(c context.Context, id int) (types.UtiPatient, error) {
	u, ok := types.FromUserContext(c)
	if !ok {
		return types.UtiPatient{}, types.ErrUnauhtorized
	}
	patient, err := ps.repo.GetById(c, id, true)
	if err != nil {
		return types.UtiPatient{}, err
	}

	if patient.UserID != u.Id && !u.Admin {
		return types.UtiPatient{}, types.ErrUnauhtorized
	}
	return patient, nil
}


func (ps *UtiPatientService) Create(c context.Context, dto dto.CreateUtiPatientDTO) (types.UtiPatient, error) {
	u, ok := types.FromUserContext(c)
	if !ok {
		return types.UtiPatient{}, types.ErrUnauhtorized
	} 

	patient := types.UtiPatient{ UserID: u.Id, Name: dto.Name, Birthday: null.NewTime(dto.Birthday, true), Description: null.NewString(dto.Description, true), Created: time.Now().UTC(), Deleted: false }
	names, err := ps.repo.FindByName(c, dto.Name, false)
	if err != nil {
		return types.UtiPatient{}, err
	}
	if len(names) != 0 {
		return types.UtiPatient{}, types.ErrAlreadyExists
	}
	p, err := ps.repo.Create(c, patient)
	if err != nil {
		return types.UtiPatient{}, err
	}
	err = ps.qRepo.JoinQueue(c, p.ID)
	return p, err
}
func (ps *UtiPatientService) Update(c context.Context, dto dto.UpdateUtiPatientDTO) error {
	u, ok := types.FromUserContext(c)
	if !ok {
		return types.ErrUnauhtorized
	} 

	patient, err := ps.repo.GetById(c, dto.Id, false)
	if err != nil {
		return  err
	}

	if patient.UserID != u.Id && !u.Admin {
		return types.ErrUnauhtorized
	}

	if dto.Name != patient.Name {
		names, err := ps.repo.FindByName(c, dto.Name, false)
		if err != nil {
			return  err
		}
		if len(names) != 0 {
			return types.ErrAlreadyExists
		}
	}

	patient.Name = dto.Name
	patient.Description = null.NewString(dto.Description, true)
	patient.Birthday = null.NewTime(dto.Birthday, true)

	return ps.repo.Update(c, patient)
}
func (ps *UtiPatientService) Delete(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok { return types.ErrUnauhtorized }

	p, err := ps.repo.GetById(c, id, false)
	if err != nil { return err }
	if p.UserID != u.Id && !u.Admin {
		return types.ErrUnauhtorized
	}
	inQ, err := ps.qRepo.IsInQueue(c, id)
	if err != nil { return err }
	if inQ {
		err = ps.qRepo.LeaveQueue(c, id)
		if err != nil { return err }
		err = ps.qRepo.FixupQueuePositions(c)
		if err != nil { return err }
	}
	return ps.repo.Delete(c, id)
}

func (ps *UtiPatientService) JoinQueue(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok { return types.ErrUnauhtorized }

	p, err := ps.repo.GetById(c, id, false)
	if err != nil { return err }
	if p.UserID != u.Id && !u.Admin {
		return types.ErrUnauhtorized
	}
	inQ, err := ps.qRepo.IsInQueue(c, id)
	if err != nil { return err }
	if inQ {
		return types.ErrValidation
	}
	
	return ps.qRepo.JoinQueue(c, id)
}

func (ps *UtiPatientService) LeaveQueue(c context.Context, id int, reorderPositions bool) error {
	u, ok := types.FromUserContext(c)
	if !ok { return types.ErrUnauhtorized }

	p, err := ps.repo.GetById(c, id, false)
	if err != nil { return err }
	if p.UserID != u.Id && !u.Admin {
		return types.ErrUnauhtorized
	}
	inQ, err := ps.qRepo.IsInQueue(c, id)
	if err != nil { return err }
	if !inQ {
		return types.ErrValidation
	}
	
	err = ps.qRepo.LeaveQueue(c, id)	
	if err != nil {
		return err
	}
	if reorderPositions {
		return ps.qRepo.FixupQueuePositions(c)
	}
	return nil
}

func (ps *UtiPatientService) GetQueueInfo(c context.Context) (types.QueueInfo, error) {
	return ps.qRepo.GetQueueInfo(c)
}