type UtiPatient = {
  id: number
  user_id: number
  name: string
  birthday: string
  description: string | null
  created: string
  deleted: boolean
  session_count: number
  last_session: string | null
  position: number | null
  joined: string | null
  queue_size: number
}

export default UtiPatient