package main

import (
	"api/controller"
	"database/sql"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)


func main() {
	 // connect to database
	 url := os.Getenv("DATABASE_URL")
	 db, err := sql.Open("postgres", url)
	 if err != nil {
			log.Fatal(err)
	 }
	 defer db.Close()

	 // create table if it doesn't exist
	 _, err = db.Exec("CREATE TABLE IF NOT EXISTS pacients (id SERIAL PRIMARY KEY, name TEXT, email TEXT)")
	 if err != nil {
			 log.Fatal(err)
	 }
	 
	controller := controller.PacientController{ DB: db }
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/api/pacients", controller.GetAll)

	router.Run(":8080")
}