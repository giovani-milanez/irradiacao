package types

import (
	"context"
	"time"
)

type User struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Member bool   `json:"member"`
	Admin  bool   `json:"admin"`
	Avatar string `json:"avatar"`
	Created time.Time `json:"created"`
}

type userKey string

func NewUserContext(ctx context.Context, u User) context.Context {
	return context.WithValue(ctx, userKey("user"), u)
}

func FromUserContext(ctx context.Context) (User, bool) {
	u, ok := ctx.Value(userKey("user")).(User)
	return u, ok
}

type IUserRepository interface {	
	FindAll(c context.Context) ([]User, error)
	FindById(c context.Context, id int) (User, error)
	FindByEmail(c context.Context, email string) (User, error)
	Create(c context.Context, user User) (User, error)
	Update(c context.Context, user User) error
	Delete(c context.Context, id int) error
}