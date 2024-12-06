package repository

import (
	"api/types"
	"context"
	"database/sql"
	"fmt"
	"strings"
)

type SessionRepository struct {
	DB *sql.DB
}

func NewSessionRepository(db *sql.DB) *SessionRepository {
	return &SessionRepository{DB: db}
}

func (r *SessionRepository) runSelect(c context.Context, where string, includes bool, args ...any) ([]types.Session, error) {
	query := fmt.Sprintf(`
SELECT 
		s.*,
    (SELECT COUNT(*) AS patient_count FROM patients_session ps WHERE ps.id_session = s.id),
    (SELECT COUNT(*) AS uti_count FROM uti_session us WHERE us.id_session = s.id),
		(SELECT COUNT(*) AS members_count FROM members_session ms WHERE ms.id_session = s.id)     
FROM 
    sessions s
		%s
ORDER BY s.date desc
	`, where)
	if !includes {
		query = fmt.Sprintf("SELECT * from sessions p %s", where)
	}
	rows, err := r.DB.QueryContext(c, query, args...)
	if err != nil {
		return []types.Session{}, err
	}
	defer rows.Close()

	users := []types.Session{}
	for rows.Next() {
			var u types.Session
			if includes {
				if err := rows.Scan(&u.Id, &u.IdUser, &u.Title, &u.Description, &u.Place, &u.Done, &u.Date, &u.PatientsCount, &u.UtiCount, &u.MembersCount); err != nil {
					return []types.Session{}, err
				}
			} else {
				if err := rows.Scan(&u.Id, &u.IdUser, &u.Title, &u.Description, &u.Place, &u.Done, &u.Date); err != nil {
					return []types.Session{}, err
				}
			}
			users = append(users, u)
	}
	if err := rows.Err(); err != nil {
		return []types.Session{}, err
	}
	return users, nil
}

func (r *SessionRepository) GetById(c context.Context, id int, includes bool) (types.Session, error) {
  ret, err := r.runSelect(c, "WHERE id = $1", includes, id)
	if err != nil {
		return types.Session{}, err
	}
  if len(ret) == 0 {
    return types.Session{}, types.ErrNotFound
  }
	return ret[0], err
}
func (r *SessionRepository) FindAll(c context.Context) ([]types.Session, error) {
	return r.runSelect(c, "", true)
}
func (r *SessionRepository) Create(c context.Context, item types.Session) (types.Session, error) {
	var id int
	err := r.DB.QueryRowContext(c, "INSERT INTO sessions (id_user, title, \"desc\", place, done, \"date\") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", item.IdUser, item.Title, item.Description, item.Place, false, item.Date).Scan(&id)
	
	if err != nil {
		return types.Session{}, err
	}
	item.Id = int(id)
	return item, nil
}

func (r *SessionRepository) Update(c context.Context, item types.Session) error {
	_, err := r.DB.ExecContext(c, "UPDATE sessions SET title = $2, \"desc\" = $3, place = $4, done = $5, \"date\" = $6 where id = $1", item.Id, item.Title, item.Description, item.Place, item.Done, item.Date)
	if err != nil {
		return err
	}
	return nil
}
func (r *SessionRepository) Delete(c context.Context, id int) error {
	_, err := r.DB.ExecContext(c, "DELETE from sessions where id = $1", id)
	if err != nil {
		return err
	}
	return nil
}


func (r *SessionRepository) UpdatePatients(c context.Context, id int, patients []int) error {
	_, err := r.DB.ExecContext(c, "DELETE from patients_session where id_session = $1", id)
	if err != nil {
		return err
	}
	if len(patients) == 0 {
		return nil
	}

	var sb strings.Builder
	sb.WriteString("INSERT INTO patients_session (id_patient, id_session) VALUES ")
	for _, p := range patients {
		sb.WriteString(fmt.Sprintf("(%d, %d), ", p, id))
	}
	sql := sb.String()
	sql = sql[:len(sql)-2]
	_, err = r.DB.ExecContext(c, sql)
	return err
}
func (r *SessionRepository) UpdateUtis(c context.Context,id int, patients []int) error {
	_, err := r.DB.ExecContext(c, "DELETE from uti_session where id_session = $1", id)
	if err != nil {
		return err
	}
	if len(patients) == 0 {
		return nil
	}

	var sb strings.Builder
	sb.WriteString("INSERT INTO uti_session (id_uti, id_session) VALUES ")
	for _, p := range patients {
		sb.WriteString(fmt.Sprintf("(%d, %d), ", p, id))
	}
	sql := sb.String()
	sql = sql[:len(sql)-2]
	_, err = r.DB.ExecContext(c, sql)
	return err
}
func (r *SessionRepository) UpdateMembers(c context.Context,id int, members []int) error {
	_, err := r.DB.ExecContext(c, "DELETE from members_session where id_session = $1", id)
	if err != nil {
		return err
	}
	if len(members) == 0 {
		return nil
	}

	var sb strings.Builder
	sb.WriteString("INSERT INTO members_session (id_member, id_session) VALUES ")
	for _, p := range members {
		sb.WriteString(fmt.Sprintf("(%d, %d), ", p, id))
	}
	sql := sb.String()
	sql = sql[:len(sql)-2]
	_, err = r.DB.ExecContext(c, sql)
	return err
}