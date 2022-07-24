
import Link from "next/link"
import { useCookies } from "react-cookie"
import { useState, useEffect } from "react"
import toast, { Toaster } from 'react-hot-toast';
import styled from "styled-components";
import {device} from '../styles/device.css'
const HeaderStyle = styled.header`
  padding:20px 50px;
  background-color: #fff;
  nav{
    display: flex;  
    align-items: center;
    justify-content: space-between;
  }
  .navActions{
    display: flex;
    align-items: center;
    gap: 15px;
    @media ${device.mobile}{
      gap: 150px;
    }
    a{
      color: var(--primary);
      font-weight: bold;
      will-change: color;
      transition: color .2s ease-out;
      &:hover{
        color: var(--secondary);
      }
      &:first-child{
        margin-right:62px;
      }
    }
  }
  .accountActions{
    display: flex;
    align-items: center;
    gap: 30px;
  }
`

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
    <HeaderStyle>
      <Toaster/>
      <nav>
        <div className="navActions">
          <h1>
            <Link href="/">
              <a>
                Mon app
              </a>
            </Link>
          </h1>
          <ul>
            <li>
              <Link href='/auth/signup'>
                <a>
                  S&apos;inscrire
                </a>
              </Link>
            </li>
            <li>
              <button onClick={(e) => logout(e)}>
                Se déconnecter
              </button>
            </li>
          </ul>
        </div>
        {currentUser ? (
          <ul className="accountActions">
            <li>Thumbs</li>
            <li>Notif</li>
            <li>
              <Link href={`/profile/${currentUser?.pseudo}`}>
                <a>
                  Account
                </a>
              </Link>
            </li>
        </ul>
        ) : (
          <Link href='/auth/signin'>
            <a>
              Se connecter
            </a>
          </Link>
        )}
        
      </nav>
    </HeaderStyle>
  )
}