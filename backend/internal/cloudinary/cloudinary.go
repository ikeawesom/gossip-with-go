package cloudinary

import (
	"errors"
	"log"

	"github.com/cloudinary/cloudinary-go/v2"
)

var Cloudinary *cloudinary.Cloudinary

func InitCloudinary(name, key, secret string) error {
	cld, err := cloudinary.NewFromParams(name, key, secret)

	if err != nil {
		return errors.New(err.Error())
	}

	log.Println("cloudinary connected successfully")
	Cloudinary = cld
	
	return nil
}