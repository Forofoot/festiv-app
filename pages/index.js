import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/dist/client/router'
import styled from 'styled-components'
import Like from '../components/Like'
import { parseCookies } from "../helpers"
import Post from '../components/Post'

const PostContainer = styled.section`
  .postContainer{
    display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  }
  .post{
    
  }
`
export default function Home({post, currentUserLikes}) {

  const [currentUser, setCurrentUser] = useState(null)
  const [cookies] = useCookies(['user'])
  const [userLikes, setUserLikes] = useState([])
  
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
    <PostContainer>
      <Head>
        <title>Festiv-App</title>
        <meta
            name="description"
            content="Festiv-App"
        />
      </Head>

      <h1>Festiv-app</h1>
      {currentUser?.id}
      <h2>Bonjour {currentUser?.pseudo}</h2>
      <p>Nom des festivaliers</p>
      <p onClick={handleAddPost}>Ajouter un festival</p>
      <div className='postContainer'>
        {post.map((elt, i) =>(
          <div key={i}>
            <Post data={elt} currentUserId={currentUser?.id} currentUserLikes={currentUserLikes}/>
          </div>
        ))}
      </div>
    </PostContainer>
  )
}

export async function getServerSideProps({req, res}){
  const cookie = parseCookies(req)
  const prisma = new PrismaClient()
  const data = await prisma.post.findMany({
    select:{
      id:true,
      content:true,
      description:true,
      user:{
        select:{
          pseudo:true
        }
      },
      festival:{
        select:{
          title:true
        }
      },
      comments:{
        select:{
          content: true,
          user:{
            select:{
              pseudo:true
            }
          }
        }
      },
      likes:{
        select:{
          user:{
            select:{
              pseudo:true
            }
          }
        }
      }
    }
  })
  
  if(res){
    if(cookie.user){
      const parsedUser = JSON.parse(cookie.user)
      const user = await prisma.user.findUnique({
        where: {
          pseudo: parsedUser.pseudo,

        },
        select:{
          likes:{
            select:{
              post_id:true
            }
          }
        }
      })
      return{
        props:{
          post: data,
          currentUserLikes: user.likes
        }
      }
    }
  }
  return{
    props:{
      post: data
    }
  }
}
