package repository

import (
	"api/types"
	"context"
	"database/sql"
	"fmt"
)

type UtiPatientRepository struct {
	DB *sql.DB
}

func NewUtiPatientRepository(db *sql.DB) *UtiPatientRepository {
	return &UtiPatientRepository{ DB: db }
}

func (pr *UtiPatientRepository) runSelect(c context.Context, includes bool, inQ bool, where string, args ...any) ([]types.UtiPatient, error) {
	qJoin := "LEFT JOIN"
	if inQ { 
		qJoin = "JOIN"
	}
	query := 
	fmt.Sprintf(
	`SELECT
		(SELECT COUNT(*) AS session_count FROM uti_session ps JOIN sessions s ON s.id = ps.id_session WHERE ps.id_uti = p.id AND s.done = TRUE),
		(SELECT MAX(s.date) AS last_session FROM sessions s JOIN uti_session ps ON ps.id_session = s.id WHERE ps.id_uti = p.id AND s.done = TRUE),
		q.position, q.joined,
		u.name AS username, u.email AS useremail, u.avatar AS useravatar,
		p.*
	FROM uti_patients p
	%s uti_queue q ON q.id_uti = p.id
	LEFT JOIN users u ON u.id = p.id_user 
	%s
	ORDER BY q.position`, qJoin, where)
	if !includes {
		query = fmt.Sprintf(`
			SELECT q.position, q.joined, p.* FROM uti_patients p 
			%s uti_queue q ON q.id_uti = p.id 
			%s 
			GROUP BY p.id, q.id 
			ORDER BY q.position`, qJoin, where)
	}
	rows, err := pr.DB.QueryContext(c, query, args...)
	if err != nil {
		return []types.UtiPatient{}, err
	}
	defer rows.Close()

	size, err := pr.QueueSize(c)
	if err != nil {
		return []types.UtiPatient{}, err
	}
	// now = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	patients := []types.UtiPatient{}
	for rows.Next() {
			var u types.UtiPatient
			if includes {
				if err := rows.Scan(&u.SessionCount, &u.LastSession, &u.Position, &u.Joined, &u.UserName, &u.UserEmail, &u.UserAvatar, &u.ID, &u.UserID, &u.Name, &u.Birthday, &u.Description, &u.Created, &u.Deleted); err != nil {
					return []types.UtiPatient{}, err
				}	
			} else {
				if err := rows.Scan(&u.Position, &u.Joined, &u.ID, &u.UserID, &u.Name, &u.Birthday, &u.Description, &u.Created, &u.Deleted); err != nil {
					return []types.UtiPatient{}, err
				}
			}
			u.QueueSize = size
			patients = append(patients, u)
	}
	if err := rows.Err(); err != nil {
		return []types.UtiPatient{}, err
	}
	return patients, nil
}

func (pr *UtiPatientRepository) FindAll(c context.Context) ([]types.UtiPatient, error) {
	return pr.runSelect(c, true, false, "WHERE p.deleted = false")
}
func (pr *UtiPatientRepository) FindByName(c context.Context, name string, partial bool) ([]types.UtiPatient, error) {
	if partial {
		return pr.runSelect(c, true, false, "WHERE p.name ILIKE CONCAT('%%',$1::text,'%%') AND p.deleted = false", name)
	}
	return pr.runSelect(c, true, false, "WHERE p.name ILIKE $1::text AND p.deleted = false", name)
}
func (pr *UtiPatientRepository) FindInQueue(c context.Context) ([]types.UtiPatient, error) {
	return pr.runSelect(c, true, true, "")
}
func (pr *UtiPatientRepository) FindByUser(c context.Context, userId int) ([]types.UtiPatient, error) {
	return pr.runSelect(c, true, false, "WHERE p.id_user = $1 AND p.deleted = false", userId)
}
func (pr *UtiPatientRepository) FindBySession(c context.Context, sessionId int) ([]types.UtiPatient, error) {
	return pr.runSelect(c, false, false, "JOIN uti_session us ON us.id_uti = p.id WHERE us.id_session = $1", sessionId)
}
func (pr *UtiPatientRepository) GetById(c context.Context, id int, includes bool) (types.UtiPatient, error) {
	ret, err := pr.runSelect(c, includes, false, "WHERE p.id = $1 AND p.deleted = false", id)
	if err != nil {
		return types.UtiPatient{}, err
	}
	if len(ret) == 0 {
    return types.UtiPatient{}, types.ErrNotFound
  }
	return ret[0], err
}
func (pr *UtiPatientRepository) Create(c context.Context, patient types.UtiPatient) (types.UtiPatient, error) {
	var id int
	err := pr.DB.QueryRowContext(c, "INSERT INTO uti_patients (id_user, name, birthday, description, created, deleted) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", patient.UserID, patient.Name, patient.Birthday, patient.Description, patient.Created, patient.Deleted).Scan(&id)
	if err != nil {
		return types.UtiPatient{}, err
	}
	patient.ID = int(id)
	return patient, nil
}
func (pr *UtiPatientRepository) Update(c context.Context, patient types.UtiPatient) error {
	_, err := pr.DB.ExecContext(c, "UPDATE uti_patients SET name = $2, birthday = $3, description = $4, created = $5, deleted = $6 where id = $1", patient.ID, patient.Name, patient.Birthday, patient.Description, patient.Created, patient.Deleted)
	if err != nil {
		return err
	}
	return nil
}
func (pr *UtiPatientRepository) Delete(c context.Context, id int) error {
	rows, err := pr.DB.QueryContext(c, "SELECT id FROM uti_session WHERE id_uti = $1 LIMIT 1", id)
	if err != nil {
		return err
	}
	defer rows.Close()

	if !rows.Next() {
		_, err = pr.DB.ExecContext(c, "DELETE from uti_patients where id = $1", id)
		if err != nil {
			return err
		}
		return nil
	} else {
		_, err = pr.DB.ExecContext(c, "UPDATE uti_patients SET deleted = true where id = $1", id)
		if err != nil {
			return err
		}
		return nil
	}
}

func (pr *UtiPatientRepository) QueueSize(c context.Context) (int, error) {
	var count int
	err := pr.DB.QueryRowContext(c, "SELECT COUNT(*) FROM uti_queue").Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}