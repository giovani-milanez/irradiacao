package controller

import (
	"api/dto"
	"api/types"
	"strconv"

	// "context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UtiPatientController struct {
	service types.IUtiPatientService
}

func NewUtiPatientController(service types.IUtiPatientService) *UtiPatientController {
	return &UtiPatientController{service: service}
}

func (pc *UtiPatientController) GetAll(c *gin.Context) {
	users, err := pc.service.FindAll(Ctx(c))
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, users)
}

func (pc *UtiPatientController) Create(c *gin.Context) {
	var dto dto.CreateUtiPatientDTO
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

func (pc *UtiPatientController) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	var cDto dto.CreateUtiPatientDTO
	err = json.NewDecoder(c.Request.Body).Decode(&cDto)
	if err != nil {
		c.Error(err)
		return
	}
	uDto := dto.UpdateUtiPatientDTO{ Id: id, CreateUtiPatientDTO: cDto }
	err = pc.service.Update(Ctx(c), uDto)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}


func (pc *UtiPatientController) Delete(c *gin.Context) {	
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

func (pc *UtiPatientController) JoinQueue(c *gin.Context) {	
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	err = pc.service.JoinQueue(Ctx(c), id)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (pc *UtiPatientController) LeaveQueue(c *gin.Context) {	
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	err = pc.service.LeaveQueue(Ctx(c), id, true)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (pc *UtiPatientController) QueueInfo(c *gin.Context) {	
	
	qi, err := pc.service.GetQueueInfo(Ctx(c))
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, qi)
}

func (pc *UtiPatientController) GetById(c *gin.Context) {	
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	p, err := pc.service.GetById(Ctx(c), id)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, p)
}