package utils

import (
	"api/types"
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type MyCustomClaims struct {
	Name   string `json:"name"`
	Email  string `json:"email"`
	Admin  bool   `json:"admin"`
	Member bool   `json:"member"`
	Avatar string `json:"avatar"`
	jwt.RegisteredClaims
}

func CreateToken(user types.User, key []byte, validity time.Duration) (string, error) {
	claims := MyCustomClaims{
		Name: user.Name, Email: user.Email, Admin: user.Admin, Member: user.Member, Avatar: user.Avatar,
		RegisteredClaims: jwt.RegisteredClaims{ Subject: strconv.Itoa(user.Id), ExpiresAt: jwt.NewNumericDate(time.Now().Add(validity)) },
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(key)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string, key []byte) (types.User, error) {	
	token, err := jwt.ParseWithClaims(tokenString, &MyCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		 return key, nil
	})
 
	if err != nil {
		 return types.User{}, err
	}
	
	if !token.Valid {
		return types.User{}, fmt.Errorf("invalid token")
	}	

	if claims, ok := token.Claims.(*MyCustomClaims); ok {
		
		userId, err := strconv.Atoi(claims.Subject)
		if err != nil { return types.User{}, err }

		return types.User{Id: userId, Name: claims.Name, Email: claims.Email, Member: claims.Member, Admin: claims.Admin, Avatar: claims.Avatar }, nil
	} else {
		return types.User{}, fmt.Errorf("could not parse claims")
	}
 
}