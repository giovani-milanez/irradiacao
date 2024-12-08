package main

import (
	"api/controller"
	"api/middleware"
	"api/repository"
	"api/service"
	"strconv"
	"time"

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

	
	key := os.Getenv("JWT_KEY")
	validity, err := strconv.Atoi(os.Getenv("JWT_VALIDITY_DAYS"))
	if err != nil || key == "" {
		log.Fatal("No JWT key or validity supplied")
	}

	pRepo := repository.NewPatientRepository(db)
	uRepo := repository.NewUtiPatientRepository(db)
	qRepo := repository.NewUtiQueueRepository(db)
	userRepo := repository.NewUserRepository(db)
	sRepo := repository.NewSessionRepository(db)
	mRepo := repository.NewMemberRepository(db)

	pc := controller.NewPatientController(service.NewPatientService(pRepo))
	gc := controller.NewOAuthController(userRepo, pRepo, []byte(key), time.Hour * 24 * time.Duration(validity), os.Getenv("GOOGLE_CLIENT_ID"), os.Getenv("GOOGLE_CLIENT_SECRET"), os.Getenv("FACEBOOK_CLIENT_ID"), os.Getenv("FACEBOOK_CLIENT_SECRET"), os.Getenv("BACKEND_URL"), os.Getenv("FRONTEND_URL"))
	uc := controller.NewUtiPatientController(service.NewUtiPatientService(uRepo, qRepo))
	sc := controller.NewSessionController(service.NewSessionService(sRepo, pRepo, uRepo, userRepo, qRepo))
	mc := controller.NewMembersController(service.NewMemberService(mRepo))

	router := gin.Default()	
	router.Use(middleware.ErrorMiddleware())
	corsCfg := cors.DefaultConfig()
	corsCfg.AllowCredentials = true
	corsCfg.AllowAllOrigins = true
	corsCfg.AllowHeaders = append(corsCfg.AllowHeaders, "Authorization")
	router.Use(cors.New(corsCfg))
	auth := router.Group("/auth")
	pub  := router.Group("/api/pub")
	priv := router.Group("/api")
	priv.Use(middleware.AuthMiddleware([]byte(key)))
	
	pub.POST("/patients", pc.Create)

	priv.GET("/patients", pc.FindByUser)
	priv.GET("/patients/all", pc.GetAll)
	priv.GET("/patients/find", pc.FindByName)
	priv.GET("/patients/valids", pc.FindAllValids)
	priv.POST("/patients", pc.Create)
	priv.DELETE("/patients/:id", pc.Delete)
	priv.POST("/patients/:id/renew", pc.Renew)

	priv.GET("/uti", uc.FindByUser)
	priv.GET("/uti/all", uc.GetAll)
	priv.GET("/uti/queue", uc.FindInQueue)
	priv.POST("/uti", uc.Create)
	priv.PUT("/uti/:id", uc.Update)
	priv.GET("/uti/:id", uc.GetById)
	priv.GET("/uti/queue-info", uc.QueueInfo)
	priv.DELETE("/uti/:id", uc.Delete)
	priv.POST("/uti/:id/queue/leave", uc.LeaveQueue)
	priv.POST("/uti/:id/queue/join", uc.JoinQueue)

	priv.GET("/session", sc.GetAll)
	priv.POST("/session", sc.Create)
	priv.PUT("/session/:id", sc.Update)
	priv.GET("/session/:id", sc.GetById)
	priv.DELETE("/session/:id", sc.Delete)
	priv.POST("/session/:id/finish", sc.Finish)

	priv.GET("/members", mc.GetAll)
	priv.POST("/members", mc.Create)
	priv.PUT("/members/:id", mc.Update)
	priv.DELETE("/members/:id", mc.Delete)

	auth.GET("/:provider/login", gc.Login)
	auth.GET("/:provider/callback", gc.Callback)
	priv.GET("/users", gc.FindAll)

	router.Run(":8080")
}



/*
	user

	/api/user/register
	/api/user/login


	patient

	GET    /api/patient
	GET    /api/patient/all   *admin/member*
	GET    /api/patient/valid *admin/member*
	POST   /api/patient
	GET    /api/patient/{id}
	PUT    /api/patient/{id}
	DELETE /api/patient/{id}

	session

	GET    /api/session/upcoming  
	GET    /api/session            *admin/member*
	POST   /api/session            *admin*
	GET    /api/session/{id}       *admin/member*
	PUT    /api/session/{id}       *admin*
	DELETE /api/session/{id}       *admin*
	POST   /api/session/{id}/done  *admin*
*/