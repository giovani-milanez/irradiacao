import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
// import UserContext, { TUser } from "./user-context";

export type User = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  admin: boolean;
  member: boolean;
  created: string;
}

interface TUser {
  user: User | undefined
  setUser: Dispatch<SetStateAction<User | undefined>>;
  logout: () => void
}

const UserContext = createContext<TUser | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode
}

export function useAuth() {
  const consumer = useContext(UserContext);

  if (!consumer) {
    throw new Error("useAuth must be used within a UserProvider");
  }

  return consumer;
}

function parseJwt(token: string) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}



export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>();
  const router = useRouter()
  const pathname = usePathname()

  const logout = () => {
    deleteCookie('accessToken')
    router.push('/')
  }

  useEffect(() => {
    console.log('user-provider effect')
    if (user == undefined) {
      console.log('user == undefined')
      const token = getCookie('accessToken')
      if (token !== undefined) {
        const decoded = parseJwt(token.toString());
        console.log('setUser')
        console.log(decoded)
        setUser({ id: Number(decoded.sub ?? 0), admin: decoded.admin, avatar: decoded.avatar, email: decoded.email, member: decoded.member, name: decoded.name, created: '' })
        if (pathname == '/') {
          router.push('/dashboard')
        }
      } else {
        if (pathname !== '/' && pathname !== '/registrado' && pathname !== '/auth') {
          router.push('/')
        }
      }
    }
  }, [pathname, router, user])

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}