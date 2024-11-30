package middleware

import (
	"api/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(key []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		authVal := c.Request.Header["Authorization"]
		if len(authVal) <= 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{"message":"missing Authorization header"})
			return
		}
		tokens := strings.Split(authVal[0], " ")
		if len(tokens) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{"message":"invalid token header"})
			return
		}
		u, err := utils.VerifyToken(tokens[1], key)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{"message":err.Error()})
			return
		}
		c.Set("user", u)
		c.Next()
	}
}