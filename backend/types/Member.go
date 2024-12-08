package types

import "context"

type Member struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type IMemberRepository interface {
	FindAll(c context.Context) ([]Member, error)
	Create(c context.Context, member Member) (Member, error)
	Update(c context.Context, member Member) error
	Delete(c context.Context, id int) error
}

type IMemberService interface {
	FindAll(c context.Context) ([]Member, error)
	Create(c context.Context, member Member) (Member, error)
	Update(c context.Context, member Member) error
	Delete(c context.Context, id int) error
}