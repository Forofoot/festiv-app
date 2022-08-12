import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styled from 'styled-components'
import Link from 'next/link'
import { device } from '../styles/device.css'

const LandingStyle = styled.section`
    display: flex;
    padding: 40px 20px;
    flex-direction: column-reverse;
    align-items: center;
    min-height: calc(100vh - 90px);
    gap: 100px;
    @media ${device.laptop}{
        padding: 40px 120px;
        flex-direction: row;
    }
    h1{
        font-size: 2.5rem;
        margin-bottom: 30px;
    }

    p{
        margin-bottom: 20px;
        font-size: 1.125rem;
        span{
            font-weight: bold;
        }
    }
    & > * {
        flex: 1;
    }
    .bannerContainer{
        border-radius:20px;
        overflow: hidden;
        flex: 1;
        position: relative;
        min-height: 300px;
        width: 100%;
        @media ${device.laptop}{
            min-height: 530px;
        }
        span{
            position:relative;
        }
    }
`


function Landing() {
  return (
    <>
    <Head>
        <title>Festiv-App</title>
        <meta name="description" content="Découvrer Festiv'App la première application pour les plus grands passionés de musiques" />
    </Head>
    <LandingStyle>
        <div>
            <h1>Festiv&apos;App</h1>
            <p>Bienvenue sur <span>Festiv&apos;App</span> la première application déstinée pour les plus grands passionnés de musiques !</p>
            <Link href="/home">
                <a className='btnPrimary'>
                    <span>
                        Découvrir
                    </span>
                </a>
            </Link>
        </div>
      <div className='bannerContainer'>
        <Image 
            src="/homeBanner.webp"
            alt="Bannière page d'accueil"
            layout='fill'
            objectFit='cover'
        />
      </div>
    </LandingStyle>

    </>
  )
}

export default Landing