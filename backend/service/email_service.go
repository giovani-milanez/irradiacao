package service

import (
	"fmt"
	"time"

	"gopkg.in/gomail.v2"
	"api/types"
)



type EmailService struct {
	Messages chan []types.EmailMessage
	Host string
	Port int
	Username string
	Password string
	From string
}

func (em *EmailService) Run() {
	for messages := range em.Messages {
		msgs := []*gomail.Message{}
		
		for _,message := range messages {
			m := gomail.NewMessage()
			m.SetHeader("From", m.FormatAddress(em.Username, em.From))
			m.SetHeader("To", message.To...)
			m.SetHeader("Subject", message.Subject)
			m.SetBody(message.BodyType, message.Body)
			msgs = append(msgs, m)
		}
		go em.Send(msgs)
	}
}

func (em *EmailService) Send(msgs []*gomail.Message) {
	d := gomail.NewDialer(em.Host, em.Port, em.Username, em.Password)
	var s gomail.SendCloser
	var e error
	for i := 0; i < 5; i++ {
		s, e = d.Dial()
		if e == nil {
			break
		}
		fmt.Println(fmt.Sprintf("Falha ao conectar %d/%d: %s", i+1, 5, e.Error()))
		time.Sleep(5 * time.Second)
	}
	if s == nil { 
		fmt.Println("Nenhum email enviado deviado a errors...")
		return 
	}
	defer s.Close()

	for _, m := range msgs {
		for i := 0; i < 3; i++ {
			e = gomail.Send(s, m)
			if e == nil { fmt.Println(fmt.Sprintf("Email enviado a %s", m.GetHeader("To"))); break }
			fmt.Println(fmt.Sprintf("Falha ao enviar email %d/%d: %s", i+1, 3, e.Error()))
			time.Sleep(5 * time.Second)
		}
	}

}