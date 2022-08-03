import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/dist/client/router'
import styled from 'styled-components'
import { parseCookies } from "../helpers"
import Post from '../components/Post'
import { device } from '../styles/device.css'

const PostContainer = styled.section`
  .postContainer{
    padding: 40px 20px 80px 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
    justify-content: center;
    align-items: center;
    @media ${device.laptop}{
      padding: 140px 40px 40px 40px;
    }
    .btnPrimary{
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
      z-index: 10;
      @media ${device.laptop}{
        position: absolute;
        left: 40px;
        top: 140px;
        bottom: auto;
        transform: none;
      }
    }
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
      <div className='postContainer'>
        <p className='btnPrimary'><span>Ajouter un post</span></p>
        {post.map((elt, i) =>(
            <Post key={i} data={elt} currentUserId={currentUser?.id} currentUserLikes={currentUserLikes}/>
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
          updatedAt:true,
          user:{
            select:{
              pseudo:true,
              avatar:true
            }
          }
        },
        take:2,
        orderBy:{
          updatedAt:'desc'
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
