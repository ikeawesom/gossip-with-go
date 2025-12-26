package utils

import (
	"errors"
	"strconv"
)

func ParseUintParam(param string) (uint, error) {
	// parse string to uint64 first
	id, err := strconv.ParseUint(param, 10, 64)
	if err != nil {
		return 0, errors.New("parameter must be a valid positive number")
	}

	return uint(id), nil
}