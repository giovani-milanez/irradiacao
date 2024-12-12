package types

type EmailMessage struct {
	To []string
	Subject string
	BodyType string
	Body string
}

type EmailData struct {
	Nome string
	Data string
	HasGeral bool
	HasUti bool
	Geral []string
	Uti []string
}