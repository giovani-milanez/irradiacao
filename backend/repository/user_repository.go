package repository

import (
	"api/types"
	"context"
	"database/sql"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) runSelect(c context.Context, query string, args ...any) ([]types.User, error) {
	rows, err := r.DB.QueryContext(c, query, args...)
	if err != nil {
		return []types.User{}, err
	}
	defer rows.Close()

	users := []types.User{}
	for rows.Next() {
			var u types.User
			if err := rows.Scan(&u.Id, &u.Name, &u.Email, &u.Member, &u.Admin, &u.Avatar); err != nil {
				return []types.User{}, err
			}
			users = append(users, u)
	}
	if err := rows.Err(); err != nil {
		return []types.User{}, err
	}
	return users, nil
}

func (r *UserRepository) FindAll(c context.Context) ([]types.User, error) {
	return r.runSelect(c, "SELECT * FROM users")
}

func (r *UserRepository) FindById(c context.Context, id int) (types.User, error) {
  ret, err := r.runSelect(c, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return types.User{}, err
	}
  if len(ret) == 0 {
    return types.User{}, types.ErrNotFound
  }
	return ret[0], err
}
func (r *UserRepository) FindByEmail(c context.Context, email string) (types.User, error) {
  ret, err := r.runSelect(c, "SELECT * FROM users WHERE email = $1", email)
  if err != nil {
		return types.User{}, err
	}
  if len(ret) == 0 {
    return types.User{}, types.ErrNotFound
  }
	return ret[0], err
}
func (r *UserRepository) Create(c context.Context, user types.User) (types.User, error) {
	var id int
	err := r.DB.QueryRowContext(c, "INSERT INTO users (name, email, member, admin, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING id", user.Name, user.Email, user.Member, user.Admin, user.Avatar).Scan(&id)
	
	if err != nil {
		return types.User{}, err
	}
	user.Id = int(id)
	return user, nil
}

func (r *UserRepository) Update(c context.Context, user types.User) error {
	_, err := r.DB.ExecContext(c, "UPDATE users SET name = $2, email = $3, member = $4, admin = $5, avatar = $6 where id = $1", user.Id, user.Name, user.Email, user.Member, user.Admin, user.Avatar)
	if err != nil {
		return err
	}
	return nil
}
func (r *UserRepository) Delete(c context.Context, id int) error {
	_, err := r.DB.ExecContext(c, "DELETE from users where id = $1", id)
	if err != nil {
		return err
	}
	return nil
}