package hash

import "golang.org/x/crypto/bcrypt"

func Password(password string) (string, error) {
	result, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(result), err
}

func CheckPassword(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
