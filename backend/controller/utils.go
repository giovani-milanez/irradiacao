package controller

import (
	"api/types"
	"context"

	"github.com/gin-gonic/gin"
)

func Ctx(c *gin.Context) context.Context {
	ctx := c.Request.Context()
	
	u, exists := c.Get("user")
	if exists {
		ctx = types.NewUserContext(ctx, u.(types.User))
	}

	return ctx
}

func HandleError(c *gin.Context, err error) {

}