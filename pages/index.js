import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/dist/client/router'

export default function Home({post}) {

  const [currentUser, setCurrentUser] = useState(null)
  const [cookies] = useCookies(['user'])
  const router = useRouter()
  const handleAddPost = async() =>{
    const res = await fetch(`/api/post/createPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Test Festival '+Math.floor(Math.random() * 1000) + 1,
          festival_id:1,
          user_id:21
       }),
    })
    if(res.ok){
      router.replace(router.asPath) 
    }
  }

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
      <p onClick={handleAddPost}>Ajouter un festival</p>
      {post.map((elt, i) =>(
        <div key={i}>
          <p>{elt.content}</p>
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps(){
  const prisma = new PrismaClient()
  const data = await prisma.post.findMany()
  return{
    props:{
      post: data
    }
  }
}
