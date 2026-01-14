package utils

import "strings"

func ExtractPublicID(url string) string {
	parts := strings.Split(url, "/upload/")
	if len(parts) < 2 {
		return ""
	}

	path := parts[1]                       
	path = strings.SplitN(path, "/", 2)[1] 
	path = strings.Split(path, ".")[0]     

	return path
}