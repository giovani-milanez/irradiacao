package types

type EmailMessage struct {
	To []string
	Subject string
	BodyType string
	Body string
}

type EmailData_SessaoRealizada struct {
	Nome string
	Data string
	HasUti bool
	Uti []string
	HasPatient bool
	Patient []string
}

type EmailData_SessaoCriada struct {
	NomeUsuario string
	Nomes []string
	Data string
	Hora string
}

type EmailData_Cadastro struct {
	Nome string
	LinkUti string
	LinkGeral string
}