package controller

import (
	"api/dto"
	"api/types"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type SessionController struct {
	service types.ISessionService
}

func NewSessionController(service types.ISessionService) *SessionController {
	return &SessionController{service: service}
}

func (pc *SessionController) GetAll(c *gin.Context) {
	users, err := pc.service.FindAll(Ctx(c))
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, users)
}

func (pc *SessionController) Create(c *gin.Context) {
	var dto dto.CreateSessiontDTO
	err := json.NewDecoder(c.Request.Body).Decode(&dto)
	if err != nil {
		c.Error(err)
		return
	}
	patient, err := pc.service.Create(Ctx(c), dto)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, patient)
}

func (pc *SessionController) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	var dto dto.CreateSessiontDTO
	err = json.NewDecoder(c.Request.Body).Decode(&dto)
	if err != nil {
		c.Error(err)
		return
	}	
	err = pc.service.Update(Ctx(c), id, dto)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (pc *SessionController) Delete(c *gin.Context) {
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

func (pc *SessionController) GetById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}
	users, err := pc.service.GetById(Ctx(c), id)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, users)
}