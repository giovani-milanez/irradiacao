package service

import (
	"api/types"
	"context"
)

type MemberService struct {
	repo types.IMemberRepository
}

func NewMemberService(repo types.IMemberRepository) *MemberService {
	return &MemberService{ repo: repo }
}

func (ps *MemberService) FindAll(c context.Context) ([]types.Member, error) {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return nil, types.ErrUnauhtorized
	}
	return ps.repo.FindAll(c)	
}

func (ps *MemberService) Create(c context.Context, member types.Member) (types.Member, error) {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.Member{}, types.ErrUnauhtorized
	}
	return ps.repo.Create(c, member)
}
func (ps *MemberService) Update(c context.Context, member types.Member) error {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.ErrUnauhtorized
	}
	return ps.repo.Update(c, member)
}
func (ps *MemberService) Delete(c context.Context, id int) error {
	u, ok := types.FromUserContext(c)
	if !ok || !u.Admin {
		return types.ErrUnauhtorized
	}
	
	return ps.repo.Delete(c, id)
}
