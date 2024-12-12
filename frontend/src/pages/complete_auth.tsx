import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next/client';
import { useRouter } from 'next/router'
import { hasCookie } from 'cookies-next';
import { useAuth } from '../utils/use-auth';

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function parseJwt(token: string) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(b64DecodeUnicode(base64));
}

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setUser } = useAuth();


  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      const age = searchParams.get('age')
      setCookie("accessToken", tokenParam, { maxAge: Number(age) || undefined })

      const decoded = parseJwt(tokenParam);
      console.log('setUser on auth')
      console.log(decoded)
      setUser({ id: Number(decoded.sub ?? 0), admin: decoded.admin, avatar: decoded.avatar, email: decoded.email, member: decoded.member, name: decoded.name, created: '' })

      router.push('/dashboard')
    } else if (hasCookie('accessToken')) {

      router.push('/dashboard')
    }
    else {
      router.push('/')
    }
  }, [searchParams, router, setUser])

  return <div>No token provided</div>
}