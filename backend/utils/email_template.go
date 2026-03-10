package utils

import (
	"api/types"
	"bytes"
	"html/template"
)

func loadTemplate(filename string, data any) (string, error) {
	tmpl, err := template.ParseFiles(filename)
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

func LoadTemplateSessaoRealizada(data types.EmailData_SessaoRealizada) (string, error) {
	return loadTemplate("email_sessao_realizada.html", data)
}

func LoadTemplateSessaoCriada(data types.EmailData_SessaoCriada) (string, error) {
	return loadTemplate("email_sessao_criada.html", data)
}

func LoadTemplateCadastro(data types.EmailData_Cadastro) (string, error) {
	return loadTemplate("email_cadastro.html", data)
}