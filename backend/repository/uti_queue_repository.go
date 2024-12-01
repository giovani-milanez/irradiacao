package repository

import (
	"api/types"
	"context"
	"database/sql"
	"time"

	"github.com/guregu/null/v5"
)

type UtiQueueRepository struct {
	DB *sql.DB
}

func NewUtiQueueRepository(db *sql.DB) *UtiQueueRepository {
	return &UtiQueueRepository{ DB: db }
}

func (pr *UtiQueueRepository) JoinQueue(c context.Context, id int) error {
	size, err := pr.QueueSize(c)
	if err != nil {
		return err
	}
	_, err = pr.DB.ExecContext(c, "INSERT INTO uti_queue (id_uti, joined, position) VALUES ($1, $2, $3)", id, time.Now().UTC(), size+1)
	if err != nil {
		return err
	}
	return nil
}
func (pr *UtiQueueRepository) FixupQueuePositions(c context.Context) error {
	// fix up position
	_, err := pr.DB.ExecContext(c, `
	WITH qp AS (SELECT row_number() OVER (ORDER BY q.position ASC) as pos, q.* FROM uti_queue q)
	UPDATE uti_queue q SET position = qp.pos FROM qp WHERE q.id = qp.id`)
	return err	
}

func (pr *UtiQueueRepository) LeaveQueue(c context.Context, id int) error {
	_, err := pr.DB.ExecContext(c, "DELETE from uti_queue where id_uti = $1", id)
	if err != nil {
		return err
	}
	// pr.fixupQueuePositions(c)
	return nil
}
func (pr *UtiQueueRepository) IsInQueue(c context.Context, id int) (bool, error) {
	rows, err := pr.DB.QueryContext(c, "SELECT id FROM uti_queue WHERE id_uti = $1 LIMIT 1", id)
	if err != nil {
		return false, err
	}
	defer rows.Close()
	return rows.Next(), nil	
}

func (pr *UtiQueueRepository) QueueSize(c context.Context) (int, error) {
	var count null.Int32
	err := pr.DB.QueryRowContext(c, "SELECT MAX(position) FROM uti_queue").Scan(&count)
	if err != nil {
		return 0, err
	}
	if !count.Valid {
		return 0, nil
	}
	return int(count.Int32), nil
}

func (pr *UtiQueueRepository) GetQueueInfo(c context.Context) (types.QueueInfo, error) {
	size, err := pr.QueueSize(c)
	if err != nil { return types.QueueInfo{}, err }

	return types.QueueInfo{ Size: size }, nil
}