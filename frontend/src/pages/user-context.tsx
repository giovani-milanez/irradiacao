'use client';
import { createContext, Dispatch, SetStateAction } from "react";

type User = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  admin: boolean;
  member: boolean;
}
type TUser = {
  user: User | undefined
  setUser: Dispatch<SetStateAction<User | undefined>>;
  logout: () => void
}

const UserContext = createContext<TUser | undefined>(undefined);
export type { User, TUser };
export default UserContext;