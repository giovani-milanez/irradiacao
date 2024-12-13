package service

import (
	"api/dto"
	"api/types"
	"api/utils"
	"context"
	"fmt"
	"time"
)

type SessionService struct {
	s_repo types.ISessionRepository
	p_repo types.IPatientRepository
	ut_repo types.IUtiPatientRepository
	u_repo types.IUserRepository
	q_repo types.IUtiQueueRepository
	mChan chan []types.EmailMessage
}

func NewSessionService(s_repo types.ISessionRepository, p_repo types.IPatientRepository, ut_repo types.IUtiPatientRepository, u_repo types.IUserRepository, qRepo types.IUtiQueueRepository, mChan chan []types.EmailMessage) *SessionService {
	return &SessionService{s_repo: s_repo, p_repo: p_repo, ut_repo: ut_repo, u_repo: u_repo, q_repo: qRepo, mChan: mChan}
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


func (ss *SessionService) Finish(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return  types.ErrUnauhtorized
	}

	s, err := ss.s_repo.GetById(c, id, false)
	if err != nil {
		return err
	}
	if (s.Done) {
		return nil
	}
	
	s.Done = true
	err = ss.s_repo.Update(c, s)
	if err != nil {
		return err
	}

	uti, err := ss.ut_repo.FindBySession(c, s.Id)
	if err != nil {
		return err
	}
	patients, err := ss.p_repo.FindBySession(c, s.Id)
	if err != nil {
		return err
	}

	for _, p := range patients {
		if !p.IdUser.Valid {
			_ = ss.p_repo.Delete(c, p.Id)
		}
	}
	for _, u := range uti {
		_ = ss.q_repo.LeaveQueue(c, u.ID)
	}

	err = ss.q_repo.FixupQueuePositions(c)
	go ss.BuildEmail(context.WithoutCancel(c), s)

	return err
}

func (ss *SessionService) BuildEmail(c context.Context, session types.Session) error {
	patients, err := ss.s_repo.GetPatientsById(c, session.Id)
	if err != nil { return err }
	utis, err := ss.s_repo.GetUtiById(c, session.Id)
	if err != nil { return err }

	loc, err := time.LoadLocation("America/Sao_Paulo")
	var dataStr string
	if err == nil {
		dataStr = session.Date.In(loc).Format("02/01/2006 15:04")
	} else {
		fmt.Println("error loading location")
		dataStr = session.Date.Format("02/01/2006 15:04")
	}

	emails := map[string]*types.EmailData{}
	for _, p := range patients {
		data, ok := emails[p.UserEmail.String]
		if !ok {
			ndata := types.EmailData{}
			ndata.Data = dataStr
			ndata.Nome = p.UserName.String
			ndata.HasGeral = true
			ndata.Geral = []string{ p.Name }
			ndata.Uti = []string{ }
			emails[p.UserEmail.String] = &ndata
		} else {
			data.Geral = append(data.Geral, p.Name)
		}
	}
	for _, p := range utis {
		data, ok := emails[p.UserEmail.String]
		if !ok {
			ndata := types.EmailData{}
			ndata.Data = dataStr
			ndata.Nome = p.UserName.String
			ndata.HasUti = true
			ndata.Uti = []string{ p.Name }
			emails[p.UserEmail.String] = &ndata
		} else {
			data.HasUti = true
			data.Uti = append(data.Uti, p.Name)
		}
	}

	messages := []types.EmailMessage{}
	for k,v := range emails {
		body, err := utils.LoadTemplate(*v)
		if err != nil {
			fmt.Println("Template error ", err)
			continue
		}
		messages = append(messages, types.EmailMessage{ To: []string{k}, Subject: "Irradiacao Recebida!", BodyType: "text/html", Body: body})
	}
	
	ss.mChan <- messages
	
	return nil
}