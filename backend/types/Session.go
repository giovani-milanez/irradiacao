package types

type Session struct {
	Id          int       `json:"id"`
	IdUser      int       `json:"id_user"`
	Title       string    `json:"title"`
	Description string    `json:"desc"`
	Place       string    `json:"place"`
	Done        bool      `json:"done"`
}