package utils

import (
	"api/types"
	"bytes"
	"html/template"
)

func LoadTemplate(data types.EmailData) (string, error) {
	tmpl, err := template.ParseFiles("email.html")
	if err != nil {
		return "", err
	}
	buf := &bytes.Buffer{}
	err = tmpl.Execute(buf, data)
	if err != nil {
		return "", err
	}
	return buf.String(), nil
}