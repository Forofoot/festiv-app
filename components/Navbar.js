
import Link from "next/link"
import { useCookies } from "react-cookie"
import { useState, useEffect } from "react"
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {

  const [cookies, setCookie, removeCookie] = useCookies()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(cookies.user)
  }, [cookies.user])
  
  const logout = (e) =>{
    e.preventDefault()
    setCurrentUser(null)
    removeCookie('user',  {path: '/'})
    toast.success('Déconnecté')
  }
  return (
    <header>
      <Toaster/>
      <nav>
        <ul>
          <li>
            <Link href='/auth/signup'>
              <a>
                S&apos;inscrire
              </a>
            </Link>
          </li>
          <li>
            <Link href='/auth/signin'>
              <a>
                Se connecter
              </a>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <button onClick={(e) => logout(e)}>
              Se déconnecter
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}