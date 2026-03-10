package middleware

import (
	"api/utils"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(key []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := tokenFromRequest(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{"message": err.Error()})
			return
		}

		u, err := utils.VerifyToken(token, key)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{"message": err.Error()})
			return
		}
		c.Set("user", u)
		c.Next()
	}
}

func tokenFromRequest(c *gin.Context) (string, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" {
		tokens := strings.Fields(authHeader)
		if len(tokens) != 2 || !strings.EqualFold(tokens[0], "Bearer") {
			return "", errors.New("invalid token header")
		}
		return tokens[1], nil
	}

	cookieToken, err := c.Cookie("accessToken")
	if err == nil && cookieToken != "" {
		return cookieToken, nil
	}

	return "", errors.New("missing authentication token")
}
