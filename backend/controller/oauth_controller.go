package controller

import (
	"api/types"
	"api/utils"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/facebook"
	"github.com/markbates/goth/providers/google"
)

type OAuthController struct {
	repo        types.IUserRepository
	key         []byte
	validity    time.Duration
	frontendUrl string
	mChan   chan []types.EmailMessage
}

func NewOAuthController(repo types.IUserRepository, key []byte, validity time.Duration, googleId string, googleSecret string, facebookId string, facebookSecret string, backendUrl string, frontendUrl string, mChan chan []types.EmailMessage) *OAuthController {
	log.Printf("Google ID: %s", googleId)
	log.Printf("Backend URL: %s", backendUrl)
	log.Printf("Frontend URL: %s", frontendUrl)
	goth.UseProviders(
		google.New(googleId, googleSecret, fmt.Sprintf("%s/auth/google/callback", backendUrl), "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"),
		facebook.New(facebookId, facebookSecret, fmt.Sprintf("%s/auth/facebook/callback", backendUrl)),
	)

	return &OAuthController{repo: repo, key: key, validity: validity, frontendUrl: frontendUrl, mChan: mChan}
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

func (pc *OAuthController) Me(c *gin.Context) {
	u, exists := c.Get("user")
	if !exists {
		c.Error(types.ErrUnauhtorized)
		return
	}

	c.JSON(http.StatusOK, u)
}

func (pc *OAuthController) Logout(c *gin.Context) {
	secure := c.Request.TLS != nil || strings.EqualFold(c.Request.Header.Get("X-Forwarded-Proto"), "https")
	c.SetSameSite(cookieSameSite(secure))
	c.SetCookie("accessToken", "", -1, "/", "", secure, true)
	c.Status(http.StatusNoContent)
}

func (pc *OAuthController) Login(c *gin.Context) {
	q := c.Request.URL.Query()
	q.Add("provider", c.Param("provider"))
	c.Request.URL.RawQuery = q.Encode()
	if gothUser, err := gothic.CompleteUserAuth(c.Writer, c.Request); err == nil {
		token, err := pc.tokenFromGoth(c, gothUser)
		if err != nil {
			c.Error(err)
			return
		}
		pc.redirectWithAccessToken(c, token)
	} else {
		gothic.BeginAuthHandler(c.Writer, c.Request)
	}

}

func (pc *OAuthController) Callback(c *gin.Context) {
	q := c.Request.URL.Query()
	q.Add("provider", c.Param("provider"))
	c.Request.URL.RawQuery = q.Encode()

	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		log.Printf("err %s", err.Error())
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}
	token, err := pc.tokenFromGoth(c, user)
	if err != nil {
		c.Error(err)
		return
	}
	pc.redirectWithAccessToken(c, token)
}

func (pc *OAuthController) redirectWithAccessToken(c *gin.Context, token string) {
	age := int(pc.validity.Seconds())
	secure := c.Request.TLS != nil || strings.EqualFold(c.Request.Header.Get("X-Forwarded-Proto"), "https")
	c.SetSameSite(cookieSameSite(secure))
	c.SetCookie("accessToken", token, age, "/", "", secure, true)

	url := fmt.Sprintf("%s/dashboard", pc.frontendUrl)
	log.Printf("returning to %s", url)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func cookieSameSite(secure bool) http.SameSite {
	if secure {
		// Cross-site XHR with credentials requires SameSite=None over HTTPS.
		return http.SameSiteNoneMode
	}
	return http.SameSiteLaxMode
}

func (pc *OAuthController) sendEmailCadastro(user types.User) error {
	body, err := utils.LoadTemplateCadastro(types.EmailData_Cadastro{Nome: user.Name, LinkUti: fmt.Sprintf("%s/uti/novo", pc.frontendUrl), LinkGeral: fmt.Sprintf("%s/dashboard", pc.frontendUrl)})
	if err != nil {
		return err
	}
	message := types.EmailMessage{
		To: []string{user.Email},
		Subject: "Irradiação Energética",
		BodyType: "text/html",
		Body: body,
	}
	pc.mChan <- []types.EmailMessage{message}
	return nil
}

func (pc *OAuthController) tokenFromGoth(c *gin.Context, user goth.User) (string, error) {
	u, err := pc.repo.FindByEmail(c, user.Email)
	if errors.Is(err, types.ErrNotFound) {
		u = types.User{Name: user.Name, Email: user.Email, Member: false, Admin: false, Avatar: user.AvatarURL, Created: time.Now().UTC()}
		u, err = pc.repo.Create(c, u)
		if err != nil {
			return "", err
		}
		go pc.sendEmailCadastro(u)
	} else if err != nil {
		return "", err
	}

	token, err := utils.CreateToken(u, pc.key, pc.validity)
	if err != nil {
		return "", err
	}
	return token, nil
}
