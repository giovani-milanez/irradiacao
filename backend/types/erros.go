package types

import "errors"

var ErrNotFound = errors.New("not found")
var ErrAlreadyExists = errors.New("already exists")
var ErrUnauhtorized = errors.New("unauthorized")
var ErrValidation = errors.New("validation error")