import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

export default function Home({data}) {

  const [currentUser, setCurrentUser] = useState(null)
  const [cookies] = useCookies(['user'])

  useEffect(() => {
    setCurrentUser(cookies.user)
  }, [cookies.user])
  return (
    <div>
      <Head>
        <title>Festiv-App</title>
        <meta
            name="description"
            content="Festiv-App"
        />
      </Head>

      <h1>Festiv-app</h1>
      
      <h2>Bonjour {currentUser?.pseudo}</h2>
      <p>Nom des festivaliers</p>
      {data.map((elt, i) =>(
        <div key={i}>
          <p>{elt.pseudo}</p>
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps(){
  const prisma = new PrismaClient()
  const data = await prisma.user.findMany()
  return{
    props:{
      data
    }
  }
}
