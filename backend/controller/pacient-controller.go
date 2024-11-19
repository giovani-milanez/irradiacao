package controller

import (
	"api/types"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PacientController struct {
	DB *sql.DB
}

func (pc *PacientController) GetAll(c *gin.Context) {
	rows, err := pc.DB.Query("SELECT * FROM pacients")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	users := []types.Pacient{} // array of users
	for rows.Next() {
			var u types.Pacient
			if err := rows.Scan(&u.Id, &u.Name, &u.Email); err != nil {
					log.Fatal(err)
			}
			users = append(users, u)
	}
	if err := rows.Err(); err != nil {
			log.Fatal(err)
	}

	c.JSON(http.StatusOK, users)
}