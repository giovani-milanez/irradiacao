package controller

import (
	"api/dto"
	"api/types"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MembersController struct {
	service types.IMemberService
}

func NewMembersController(service types.IMemberService) *MembersController {
	return &MembersController{service: service}
}

func (pc *MembersController) GetAll(c *gin.Context) {
	users, err := pc.service.FindAll(Ctx(c))
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, users)
}

func (pc *MembersController) Create(c *gin.Context) {
	var dto dto.CreateMemberDTO
	err := json.NewDecoder(c.Request.Body).Decode(&dto)
	if err != nil {
		c.Error(err)
		return
	}
	patient, err := pc.service.Create(Ctx(c), types.Member{Name: dto.Name})
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, patient)
}

func (pc *MembersController) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	var dto dto.CreateMemberDTO
	err = json.NewDecoder(c.Request.Body).Decode(&dto)
	if err != nil {
		c.Error(err)
		return
	}	
	err = pc.service.Update(Ctx(c), types.Member{Id: id, Name: dto.Name})
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (pc *MembersController) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	err = pc.service.Delete(Ctx(c), id)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
