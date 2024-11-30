"use client";

import { useEffect, useState } from "react";
import UserContext, { User } from "./user-context";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

function parseJwt(token: string) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

export default function UserProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        setUser({ id: Number(decoded.sub ?? 0), admin: decoded.admin, avatar: decoded.avatar, email: decoded.email, member: decoded.member, name: decoded.name })
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
    <>
      <UserContext.Provider value={{ user, setUser, logout }}>
        {children}
      </UserContext.Provider>
    </>
  );
}