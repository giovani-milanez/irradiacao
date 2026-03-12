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
	u_repo  types.IUserRepository
	q_repo  types.IUtiQueueRepository
	mChan   chan []types.EmailMessage
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

func (ss *SessionService) sendEmailSessaoCriada(c context.Context, session types.Session) error {
	utis, err := ss.s_repo.GetUtiById(c, session.Id)
	if err != nil {
		return err
	}

	loc, err := time.LoadLocation("America/Sao_Paulo")
	var dataStr string
	if err == nil {
		dataStr = session.Date.In(loc).Format("02/01/2006")
	} else {
		fmt.Println("error loading location")
		dataStr = session.Date.Format("02/01/2006")
	}

	emails := map[string]*types.EmailData_SessaoCriada{}
	for _, p := range utis {
		data, ok := emails[p.UserEmail.String]
		if !ok {
			ndata := types.EmailData_SessaoCriada{}
			ndata.Data = dataStr
			ndata.Hora = session.Date.In(loc).Format("15:04")
			ndata.NomeUsuario = p.UserName.String
			ndata.Nomes = []string{p.Name}
			emails[p.UserEmail.String] = &ndata
		} else {
			data.Nomes = append(data.Nomes, p.Name)
		}
	}

	messages := []types.EmailMessage{}
	for k, v := range emails {
		body, err := utils.LoadTemplateSessaoCriada(*v)
		if err != nil {
			fmt.Println("Template error ", err)
			continue
		}
		messages = append(messages, types.EmailMessage{To: []string{k}, Subject: "Irradiação Agendada", BodyType: "text/html", Body: body})
	}

	ss.mChan <- messages

	return nil
}

func (ss *SessionService) Create(c context.Context, item dto.CreateSessiontDTO) (types.Session, error) {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.Session{}, types.ErrUnauhtorized
	}

	s := types.Session{
		IdUser:      u.Id,
		Title:       item.Title,
		Description: item.Desc,
		Place:       item.Place,
		PlaceImg:    item.PlaceImg,
		Date:        item.Date,
		Done:        false,
	}
	s, err := ss.s_repo.Create(c, s)
	if err != nil {
		return types.Session{}, err
	}
	err = ss.s_repo.UpdatePatients(c, s.Id, item.PatientIds)
	if err != nil {
		return types.Session{}, err
	}
	err = ss.s_repo.UpdateUtis(c, s.Id, item.UtiIds)
	go func() {
		err := ss.sendEmailSessaoCriada(context.WithoutCancel(c), s)
		if err != nil {
			fmt.Println("Error sending email sessao criada", err)
		}
	}()
	return s, err
}
func (ss *SessionService) Update(c context.Context, id int, item dto.CreateSessiontDTO) error {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.ErrUnauhtorized
	}

	s, err := ss.s_repo.GetById(c, id, false)
	if err != nil {
		return err
	}

	s.Title = item.Title
	s.Description = item.Desc
	s.Place = item.Place
	s.PlaceImg = item.PlaceImg
	s.Date = item.Date

	err = ss.s_repo.Update(c, s)
	if err != nil {
		return err
	}
	return ss.s_repo.UpdateUtis(c, id, item.UtiIds)
}

func (ss *SessionService) Delete(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.ErrUnauhtorized
	}
	return ss.s_repo.Delete(c, id)
}

func (ss *SessionService) Finish(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.ErrUnauhtorized
	}

	s, err := ss.s_repo.GetById(c, id, false)
	if err != nil {
		return err
	}
	if s.Done {
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

	for _, u := range uti {
		_ = ss.q_repo.LeaveQueue(c, u.ID)
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

	err = ss.q_repo.FixupQueuePositions(c)
	go func() {
		err := ss.BuildEmail(context.WithoutCancel(c), s)
		if err != nil {
			fmt.Println("Error sending email sessao realizada", err)
		}
	}()

	return err
}

func (ss *SessionService) BuildEmail(c context.Context, session types.Session) error {
	utis, err := ss.s_repo.GetUtiById(c, session.Id)
	if err != nil {
		return err
	}
	patients, err := ss.s_repo.GetPatientsById(c, session.Id)
	if err != nil { return err }

	loc, err := time.LoadLocation("America/Sao_Paulo")
	var dataStr string
	if err == nil {
		dataStr = session.Date.In(loc).Format("02/01/2006 15:04")
	} else {
		fmt.Println("error loading location")
		dataStr = session.Date.Format("02/01/2006 15:04")
	}

	emails := map[string]*types.EmailData_SessaoRealizada{}
	for _, p := range utis {
		data, ok := emails[p.UserEmail.String]
		if !ok {
			ndata := types.EmailData_SessaoRealizada{}
			ndata.Data = dataStr
			ndata.Nome = p.UserName.String
			ndata.HasUti = true
			ndata.Uti = []string{p.Name}
			emails[p.UserEmail.String] = &ndata
		} else {
			data.HasUti = true
			data.Uti = append(data.Uti, p.Name)
		}
	}

	for _, p := range patients {
		data, ok := emails[p.UserEmail.String]
		if !ok {
			ndata := types.EmailData_SessaoRealizada{}
			ndata.Data = dataStr
			ndata.Nome = p.UserName.String
			ndata.HasPatient = true
			ndata.Patient = []string{p.Name}
			emails[p.UserEmail.String] = &ndata
		} else {
			data.HasPatient = true
			data.Patient = append(data.Patient, p.Name)
		}
	}

	messages := []types.EmailMessage{}
	for k, v := range emails {
		body, err := utils.LoadTemplateSessaoRealizada(*v)
		if err != nil {
			fmt.Println("Template error ", err)
			continue
		}
		messages = append(messages, types.EmailMessage{To: []string{k}, Subject: "Irradiação Recebida!", BodyType: "text/html", Body: body})
	}

	ss.mChan <- messages

	return nil
}
