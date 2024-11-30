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

type PatientController struct {
	service types.IPatientService
}

func NewPatientController(service types.IPatientService) *PatientController {
	return &PatientController{service: service}
}

func (pc *PatientController) GetAll(c *gin.Context) {
	users, err := pc.service.FindAll(Ctx(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, users)
}

func (pc *PatientController) Create(c *gin.Context) {
	var dto dto.CreatePatientDTO
	err := json.NewDecoder(c.Request.Body).Decode(&dto)
	if err != nil {
		c.Error(err)
		// http.Error(c.Writer, err.Error(), http.StatusBadRequest)
		return
	}
	patient, err := pc.service.Create(Ctx(c), dto)
	if err != nil {
		c.Error(err)
		// c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, patient)
}

func (pc *PatientController) FindByName(c *gin.Context) {
	users, err := pc.service.FindByName(c.Request.Context(), c.Query("name"), true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, users)
}

func (pc *PatientController) Delete(c *gin.Context) {	
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

func (pc *PatientController) Renew(c *gin.Context) {	
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	err = pc.service.Renew(Ctx(c), id)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}