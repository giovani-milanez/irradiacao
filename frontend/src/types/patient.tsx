type Patient = {
  id: number
  id_user: number | null
  name: string
  validity: string
  created: string
  deleted: boolean
  expired: boolean
  session_count: number
  last_session: string | null
  user_name: string | null
  user_email: string | null
  user_avatar: string | null
}

export default Patient