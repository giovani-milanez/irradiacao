package middleware

import (
	"api/types"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ErrorMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		for _, err := range c.Errors {
			log.Print(err.Err)
			if errors.Is(err.Err, types.ErrNotFound) {
				c.AbortWithStatusJSON(http.StatusNotFound, map[string]string{"message": err.Err.Error()})
				return
			} else if errors.Is(err.Err, types.ErrAlreadyExists) {
				c.AbortWithStatusJSON(http.StatusBadRequest, map[string]string{"message": err.Err.Error()})
				return
			} else if errors.Is(err.Err, types.ErrUnauhtorized) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{"message": err.Err.Error()})
				return
			}
			c.AbortWithStatusJSON(http.StatusInternalServerError, map[string]string{"message":  fmt.Sprintf("Service Unavailable: %s", err.Err.Error())})
		}
	}
}