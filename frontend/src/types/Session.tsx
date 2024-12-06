import { User } from "@/pages/user-context";
import Patient from "./patient";
import UtiPatient from "./UtiPatient";

type Session = {
  id: number;
  id_user: number;
  title: string;
  desc: string;
  place: string;
  done: boolean;
  date: string;

  patients_count: number;
  uti_count: number;
  members_count: number;

  patients: Patient[];
  utis: UtiPatient[];
  members: User[];
}

export default Session