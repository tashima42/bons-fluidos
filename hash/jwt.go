package hash

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthClaims struct {
	User struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Role  string `json:"role"`
	} `json:"user"`
	jwt.RegisteredClaims
}

func NewJWT(secret []byte, auth AuthClaims) (string, error) {
	auth.RegisteredClaims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(time.Hour * 24))
	auth.RegisteredClaims.IssuedAt = jwt.NewNumericDate(time.Now())
	auth.RegisteredClaims.NotBefore = jwt.NewNumericDate(time.Now())
	auth.RegisteredClaims.Issuer = "bons-fluidos-server"
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, auth)
	return token.SignedString(secret)
}

func ParseJWT(secret []byte, tokenString string) (*AuthClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &AuthClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("jwt signing method mismatch")
		}
		return secret, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*AuthClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("failed to parse auth claims")
}
