import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import AxiosInstance from "./axiosInstance";
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

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>();
  const [authResolved, setAuthResolved] = useState(false);
  const router = useRouter()
  const pathname = usePathname()

  const logout = () => {
    AxiosInstance.post('/auth/logout').finally(() => {
      setUser(undefined)
      router.push('/')
    })
  }

  useEffect(() => {
    let cancelled = false

    AxiosInstance.get<User>('/api/me')
      .then((resp) => {
        if (cancelled) return
        setUser(resp.data)
      })
      .catch(() => {
        if (cancelled) return
        setUser(undefined)
      })
      .finally(() => {
        if (cancelled) return
        setAuthResolved(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!authResolved) return

    if (user) {
      if (pathname === '/') {
        router.push('/uti')
      }
      return
    }

    if (pathname !== '/' && pathname !== '/registrado' && pathname !== '/complete_auth') {
      router.push('/')
    }
  }, [authResolved, pathname, router, user])

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}