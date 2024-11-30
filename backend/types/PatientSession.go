package types

type PatientSession struct {
	Id          int       `json:"id"`
	IdPatient   int       `json:"id_patient"`
	IdSession   int       `json:"id_session"`
	Intensive   bool      `json:"intensive"`
}