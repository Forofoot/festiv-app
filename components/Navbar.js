
import Link from "next/link"
import { useCookies } from "react-cookie"
import { useState, useEffect } from "react"
import toast, { Toaster } from 'react-hot-toast';
import styled from "styled-components";
import {device} from '../styles/device.css'
import Image from 'next/image'
import { useRouter } from "next/router";

const HeaderStyle = styled.header`
  padding:20px 50px;
  background-color: #fff;
  position: sticky;
  top: 0;
  text-transform: uppercase;
  z-index: 10;
  nav{
    display: flex;  
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
  .navActions{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    @media ${device.mobile}{
      gap: 150px;
      width: auto;
      justify-content: flex-start;
    }
    .navActionsDesktop{
      position: relative;
      display: none;
      @media ${device.mobile}{
        display: block;
      }
    }
    .menu {
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 0;
      @media ${device.mobile}{
        display: none;
      }
      svg{
        width: 35px;
        height: 35px;
      }
      .line {
        fill: none;
        stroke: black;
        stroke-width: 6;
        transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
        stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .line1 {
        stroke-dasharray: 60 207;
        stroke-width: 6;
      }
      .line2 {
        stroke-dasharray: 60 60;
        stroke-width: 6;
      }
      .line3 {
        stroke-dasharray: 60 207;
        stroke-width: 6;
      }

      &.opened .line1 {
        stroke-dasharray: 90 207;
        stroke-dashoffset: -134;
        stroke-width: 6;
      }
      &.opened .line2 {
        stroke-dasharray: 1 60;
        stroke-dashoffset: -30;
        stroke-width: 6;
      }
      &.opened .line3 {
        stroke-dasharray: 90 207;
        stroke-dashoffset: -134;
        stroke-width: 6;
      }
    }
  }
  a{
    color: var(--primary);
    transition: color .2s ease-out;
    font-weight: bold;
    will-change: color;
    &:hover{
      color: var(--secondary);
    }
    &.active{
      color: var(--secondary);
    }
  }
  .menuActions{
    position: fixed;
    display: flex;
    height: calc(100% - 70px);
    background-color: #fff;
    width: 100%;
    right: -100%;
    z-index: 10;
    top: 70px;
    will-change: right;
    transition: right .3s linear;
    align-items: center;
    flex-direction: column-reverse;
    justify-content: center;
    gap: 30px;
    padding: 0;
    font-size: 1.75em;
    @media ${device.mobile}{
      top: 0;
      right: 0;
      width: auto;
      position: relative;
      flex-direction: row;
      justify-content: flex-start;
      font-size: 1em;
    }
    &.opened{
      right: 0;
    }
    
    .navActionsMobile{
      display: block;
      @media ${device.mobile}{
        display: none;
      }
    }
    .userAvatar{
      a{
        display: flex;
        align-items: center;
        gap: 15px;
      }
      @media ${device.mobile}{
        border-radius: 50%;
        width: 37px;
        height: 37px;
        position: relative;
        overflow: hidden;
      }
      span{
        overflow: hidden;
        border-radius: 50%;
        @media ${device.mobile}{
          width: 37px!important;
          height: 37px!important;
        }
      }
    }
  }
`

export default function Navbar() {

  const [menuActive, setMenuActive] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies()
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()

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
    <>
    {router.pathname !== '/auth/' && (
      <HeaderStyle>
      <Toaster/>
      <nav>
        <div className="navActions">
          <h1 onClick={() => setMenuActive(false)}>
            <Link href="/">
              <a>
                Mon app
              </a>
            </Link>
          </h1> 
          <div onClick={() => setMenuActive(!menuActive)} className={`menu ${menuActive ? "opened" : ""}`}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
              <path className="line line2" d="M 20,50 H 80" />
              <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
            </svg>
          </div>
          <ul className="navActionsDesktop">
            <li onClick={() => setMenuActive(!menuActive)}>
              <Link href="/">
                <a className={`${router.pathname == "/" ? "active" : ""}`}>
                  Feed
                </a>
              </Link>
            </li>
          </ul>
        </div>
          <ul className={`menuActions ${menuActive ? "opened" : ""}`}>
            {currentUser ? (
             <>
              <li className="btnLink" onClick={(e) => {logout(e); setMenuActive(!menuActive)}}>
                <Link href="/">
                  <a className="btnPrimary">
                    <span>Se déconnecter</span>
                  </a>
                </Link>
              </li>
              <li className="navActionsMobile" onClick={() => setMenuActive(!menuActive)}>
                <Link href="/">
                  <a className={`${router.pathname == "/" ? "active" : ""}`}>
                    Feed
                  </a>
                </Link>
              </li>
              <li className="userAvatar" onClick={() => setMenuActive(!menuActive)}>
                <Link href={`/profile/${currentUser?.pseudo}`}>
                  <a>
                    {currentUser?.avatar ? (
                      <Image
                        src={`${currentUser?.avatar}`}
                        alt="Avatar"
                        width={60}
                        height={60}
                        objectFit='cover'
                      />
                    ) : (
                      <Image
                        src={'/profile/avatar.webp'}
                        alt="Avatar"
                        width={60}
                        height={60}
                        objectFit='cover'
                      />
                    )}
                  </a>
                </Link>
              </li>
            </> 
            ) : (
              <>
              <li onClick={() => setMenuActive(!menuActive)}>
              <Link href='/auth/'>
                <a className={`${router.pathname == "/auth" ? "active" : ""}`}>
                  Se connecter
                </a>
              </Link>
            </li>
            <li onClick={() => setMenuActive(!menuActive)}>
              <Link href="/">
                <a className={`navActionsMobile ${router.pathname == "/" ? "active" : ""}`}  >
                  Feed
                </a>
              </Link>
            </li>
            </>
            )}
        </ul>
      </nav>
      </HeaderStyle>
    )}
    </>
    
  )
}