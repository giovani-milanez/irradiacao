package controller

import (
	"api/types"
	"api/utils"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/guregu/null/v5"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/facebook"
	"github.com/markbates/goth/providers/google"
)

type OAuthController struct {
	repo     types.IUserRepository
	pRepo    types.IPatientRepository
	key      []byte
	validity time.Duration
	frontendUrl string
}

func NewOAuthController(repo types.IUserRepository, pRepo types.IPatientRepository, key []byte, validity time.Duration, googleId string, googleSecret string, facebookId string, facebookSecret string, backendUrl string, frontendUrl string) *OAuthController {
	goth.UseProviders(
		google.New(googleId, googleSecret, fmt.Sprintf("%s/auth/google/callback", backendUrl), "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"),
		facebook.New(facebookId, facebookSecret, fmt.Sprintf("%s/auth/facebook/callback", backendUrl)),
	)
	
	return &OAuthController{ repo: repo, pRepo: pRepo, key: key, validity: validity, frontendUrl: frontendUrl }
}

func (pc *OAuthController) FindAll(c *gin.Context) {	
	u, exists := c.Get("user")
	if exists && u.(types.User).Admin {
		users, err := pc.repo.FindAll(Ctx(c))
		if err != nil {
			c.Error(err)
			return
		}
		c.JSON(http.StatusOK, users)		
	} else {
		c.Error(types.ErrUnauhtorized)
	}
}

func (pc *OAuthController) Login(c *gin.Context) {
	q :=  c.Request.URL.Query()
	q.Add("provider",  c.Param("provider"))
	c.Request.URL.RawQuery = q.Encode()
	if gothUser, err := gothic.CompleteUserAuth(c.Writer, c.Request); err == nil {
		token, err := pc.tokenFromGoth(c, gothUser)
		if err != nil { c.Error(err);	return }		
		age := int(pc.validity.Seconds())
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%s/auth?token=%s&age=%d", pc.frontendUrl, token, age))
	} else {
		gothic.BeginAuthHandler(c.Writer, c.Request)
	}

}

func (pc *OAuthController) Callback(c *gin.Context) {
	q :=  c.Request.URL.Query()
	q.Add("provider",  c.Param("provider"))
	c.Request.URL.RawQuery = q.Encode()

	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		log.Printf("err %s", err.Error())
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}
	token, err := pc.tokenFromGoth(c, user)
	if err != nil { c.Error(err);	return }
	
	age := int(pc.validity.Seconds())
	url := fmt.Sprintf("%s/complete_auth?token=%s&age=%d", pc.frontendUrl, token, age)
	log.Printf("returning to %s", url)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (pc *OAuthController) tokenFromGoth(c *gin.Context, user goth.User) (string, error) {
	u, err := pc.repo.FindByEmail(c, user.Email)
	if errors.Is(err, types.ErrNotFound) {		
		u = types.User{ Name: user.Name, Email: user.Email, Member: false, Admin: false, Avatar: user.AvatarURL, Created: time.Now().UTC() }
		u, err = pc.repo.Create(c, u)
		if err != nil {
			return "", err
		}
		patient := types.Patient{ IdUser: null.Int32From(int32(u.Id)),  Name: user.Name, Validity: time.Now().Add(time.Hour * 24 * 14).UTC(), Created: time.Now().UTC(), Deleted: false }
		pc.pRepo.Create(c, patient)		
	} else if err != nil {
		return "", err
	}
	
	token, err := utils.CreateToken(u, pc.key, pc.validity)
	if err != nil {
		return "", err
	}
	return token, nil
}