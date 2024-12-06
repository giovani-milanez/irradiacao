package service

import (
	"api/dto"
	"api/types"
	"context"
)

type SessionService struct {
	s_repo types.ISessionRepository
	p_repo types.IPatientRepository
	ut_repo types.IUtiPatientRepository
	u_repo types.IUserRepository
}

func NewSessionService(s_repo types.ISessionRepository, p_repo types.IPatientRepository, ut_repo types.IUtiPatientRepository, u_repo types.IUserRepository) *SessionService {
	return &SessionService{s_repo: s_repo, p_repo: p_repo, ut_repo: ut_repo, u_repo: u_repo}
}

func (ss *SessionService) FindAll(c context.Context) ([]types.Session, error) {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return nil, types.ErrUnauhtorized
	}
	return ss.s_repo.FindAll(c)
}
func (ss *SessionService) GetById(c context.Context, id int) (types.Session, error) {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.Session{}, types.ErrUnauhtorized
	}
	s, err := ss.s_repo.GetById(c, id, false)
	if err != nil {
		return types.Session{}, err
	}
	s.Patients, err = ss.p_repo.FindBySession(c, s.Id)
	if err != nil {
		return types.Session{}, err
	}
	s.PatientsCount = len(s.Patients)
	
	s.Uti, err = ss.ut_repo.FindBySession(c, s.Id)
	s.UtiCount = len(s.Uti)

	return s, err
}
func (ss *SessionService) Create(c context.Context, item dto.CreateSessiontDTO) (types.Session, error) {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.Session{}, types.ErrUnauhtorized
	}

	s := types.Session{ IdUser: u.Id, Title: item.Title, Description: item.Desc, Place: item.Place, Date: item.Date, Done: false }
	s, err := ss.s_repo.Create(c, s)
	if err != nil {
		return types.Session{}, err
	}
	err = ss.s_repo.UpdatePatients(c, s.Id, item.PatientIds)
	if err != nil {
		return types.Session{}, err
	}
	err = ss.s_repo.UpdateUtis(c, s.Id, item.UtiIds)
	return s, err
}
func (ss *SessionService) Update(c context.Context, id int, item dto.CreateSessiontDTO) error {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return  types.ErrUnauhtorized
	}

	s, err := ss.s_repo.GetById(c, id, false)
	if err != nil {
		return err
	}
	
	s.Title = item.Title
	s.Description = item.Desc
	s.Place = item.Place
	s.Date = item.Date
	
	err = ss.s_repo.Update(c, s)
	if err != nil {
		return err
	}
	err = ss.s_repo.UpdatePatients(c, id, item.PatientIds)
	if err != nil {
		return err
	}	
	return ss.s_repo.UpdateUtis(c, id, item.UtiIds)
}

func (ss *SessionService) Delete(c context.Context, id int) error	{
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return  types.ErrUnauhtorized
	}
	return ss.s_repo.Delete(c, id)
}
