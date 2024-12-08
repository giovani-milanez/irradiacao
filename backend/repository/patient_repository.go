package repository

import (
	"api/types"
	"context"
	"database/sql"
	"fmt"
	"time"
)

type PatientRepository struct {
	DB *sql.DB
}

func NewPatientRepository(db *sql.DB) *PatientRepository {
	return &PatientRepository{ DB: db }
}

func (pr *PatientRepository) runSelect(c context.Context, includes bool, where string, args ...any) ([]types.Patient, error) {
	query := 
	fmt.Sprintf(
	`SELECT
		(SELECT COUNT(*) AS session_count FROM patients_session ps JOIN sessions s ON s.id = ps.id_session WHERE ps.id_patient = p.id AND s.done = TRUE),
		(SELECT MAX(s.date) AS last_session FROM sessions s JOIN patients_session ps ON ps.id_session = s.id WHERE ps.id_patient = p.id AND s.done = TRUE),
		p.*
	FROM patients p
	%s
	ORDER BY p.created desc`, where)
	if !includes {
		query = fmt.Sprintf("SELECT p.* from patients p %s", where)
	}
	rows, err := pr.DB.QueryContext(c, query, args...)
	if err != nil {
		return []types.Patient{}, err
	}
	defer rows.Close()

	now := time.Now().UTC()
	now = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	patients := []types.Patient{}
	for rows.Next() {
			var u types.Patient
			if includes {
				if err := rows.Scan(&u.SessionCount, &u.LastSession, &u.Id, &u.IdUser, &u.Name, &u.Validity, &u.Created, &u.Deleted); err != nil {
					return []types.Patient{}, err
				}	
			} else {
				if err := rows.Scan(&u.Id, &u.IdUser, &u.Name, &u.Validity, &u.Created, &u.Deleted); err != nil {
					return []types.Patient{}, err
				}
			}
			u.Expired = u.Validity.Before(now)
			patients = append(patients, u)
	}
	if err := rows.Err(); err != nil {
		return []types.Patient{}, err
	}
	return patients, nil
}

func (pr *PatientRepository) FindAll(c context.Context) ([]types.Patient, error) {
	return pr.runSelect(c, true, "")
}
func (pr *PatientRepository) FindByName(c context.Context, name string, partial bool) ([]types.Patient, error) {
	if partial {
		return pr.runSelect(c, true, "WHERE p.name ILIKE CONCAT('%%',$1::text,'%%') AND p.deleted = false", name)
	}
	return pr.runSelect(c, true, "WHERE p.name ILIKE $1::text AND p.deleted = false", name)
}
func (pr *PatientRepository) FindByNameAndUser(c context.Context, userId int, name string) ([]types.Patient, error) {
	return pr.runSelect(c, true, "WHERE p.id_user = $1 AND p.name ILIKE CONCAT('%%',$2::text,'%%') AND deleted = false", userId, name)
}
func (pr *PatientRepository) FindAllValids(c context.Context) ([]types.Patient, error) {
	return pr.runSelect(c, false, "WHERE p.validity > $1 AND p.deleted = false", time.Now().UTC())
}
func (pr *PatientRepository) FindByUser(c context.Context, userId int) ([]types.Patient, error) {
	return pr.runSelect(c, true, "WHERE p.id_user = $1 AND p.deleted = false", userId)
}
func (pr *PatientRepository) FindBySession(c context.Context, sessionId int) ([]types.Patient, error) {
	return pr.runSelect(c, false, "JOIN patients_session ps ON ps.id_patient = p.id WHERE ps.id_session = $1", sessionId)
}
func (pr *PatientRepository) GetById(c context.Context, id int, includes bool) (types.Patient, error) {
	ret, err := pr.runSelect(c, includes, "WHERE p.id = $1 AND p.deleted = false", id)
	if err != nil {
		return types.Patient{}, err
	}
	if len(ret) == 0 {
    return types.Patient{}, types.ErrNotFound
  }
	return ret[0], err
}
func (pr *PatientRepository) Create(c context.Context, patient types.Patient) (types.Patient, error) {
	var id int
	err := pr.DB.QueryRowContext(c, "INSERT INTO patients (id_user, name, validity, created, deleted) VALUES ($1, $2, $3, $4, $5) RETURNING id", patient.IdUser, patient.Name, patient.Validity, patient.Created, patient.Deleted).Scan(&id)
	if err != nil {
		return types.Patient{}, err
	}
	patient.Id = int(id)
	return patient, nil
}
func (pr *PatientRepository) Update(c context.Context, patient types.Patient) error {
	_, err := pr.DB.ExecContext(c, "UPDATE patients SET name = $2, validity = $3, created = $4, deleted = $5 where id = $1", patient.Id, patient.Name, patient.Validity, patient.Created, patient.Deleted)
	if err != nil {
		return err
	}
	return nil
}
func (pr *PatientRepository) Delete(c context.Context, id int) error {
	rows, err := pr.DB.QueryContext(c, "SELECT id FROM patients_session WHERE id_patient = $1 LIMIT 1", id)
	if err != nil {
		return err
	}
	defer rows.Close()

	if !rows.Next() {
		_, err = pr.DB.ExecContext(c, "DELETE from patients where id = $1", id)
		if err != nil {
			return err
		}
		return nil
	} else {
		_, err = pr.DB.ExecContext(c, "UPDATE patients SET deleted = true where id = $1", id)
		if err != nil {
			return err
		}
		return nil
	}

}