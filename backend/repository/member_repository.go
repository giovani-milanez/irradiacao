package repository

import (
	"api/types"
	"context"
	"database/sql"
	"fmt"
)

type MemberRepository struct {
	DB *sql.DB
}

func NewMemberRepository(db *sql.DB) *MemberRepository {
	return &MemberRepository{DB: db}
}

func (pr *MemberRepository) runSelect(c context.Context, where string, args ...any) ([]types.Member, error) {
	query := 
	fmt.Sprintf(
	`SELECT m.* from members m
	%s
	ORDER BY m.name`, where)

	rows, err := pr.DB.QueryContext(c, query, args...)
	if err != nil {
		return []types.Member{}, err
	}
	defer rows.Close()
	
	members := []types.Member{}
	for rows.Next() {
			var u types.Member

			if err := rows.Scan(&u.Id, &u.Name); err != nil {
				return []types.Member{}, err
			}

			members = append(members, u)
	}
	if err := rows.Err(); err != nil {
		return []types.Member{}, err
	}
	return members, nil
}

func (pr *MemberRepository) FindAll(c context.Context) ([]types.Member, error) {
	return pr.runSelect(c, "")
}

func (pr *MemberRepository) Create(c context.Context, member types.Member) (types.Member, error) {
	var id int
	err := pr.DB.QueryRowContext(c, "INSERT INTO members (name) VALUES ($1) RETURNING id", member.Name).Scan(&id)
	if err != nil {
		return types.Member{}, err
	}
	member.Id = int(id)
	return member, nil
}

func (pr *MemberRepository) Update(c context.Context, member types.Member) error {
	_, err := pr.DB.ExecContext(c, "UPDATE members SET name = $2 where id = $1", member.Id, member.Name)
	if err != nil {
		return err
	}
	return nil
}

func (pr *MemberRepository) Delete(c context.Context, id int) error {
	_, err := pr.DB.ExecContext(c, "DELETE from members where id = $1", id)
	if err != nil {
		return err
	}
	return nil
}