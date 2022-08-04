import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/dist/client/router'
import styled from 'styled-components'
import { parseCookies } from "../helpers"
import Post from '../components/Post'
import { device } from '../styles/device.css'
import Modal from '../components/Modal'

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
      z-index: 1;
      @media ${device.laptop}{
        position: absolute;
        left: 40px;
        top: 140px;
        bottom: auto;
        transform: none;
      }
    }
  }
  .btnPrimary{
      input{
          display: none;
      }
  }
`
export default function Home({post, currentUserLikes, festival}) {

  const [currentUser, setCurrentUser] = useState(null)
  const [cookies] = useCookies(['user'])
  const [userLikes, setUserLikes] = useState([])
  const [opened, setOpened] = useState()
  const [modalOptions, setModalOptions] = useState()
  const [posts, setPosts] = useState(post)
  
  const router = useRouter()

  console.log(posts)
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
      <Modal profileId={currentUser?.id} festival={festival} setOpened={setOpened} isopened={opened} setModalOptions={setModalOptions} modalOptions={modalOptions} setPosts={setPosts}/>  
      <div className='postContainer'>
        <p className='btnPrimary' onClick={() => {setOpened(true), setModalOptions('addPost')}}><span>Ajouter un post</span></p>
        {posts.map((elt, i) =>(
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
    orderBy:{
      updatedAt:'desc'
    },
    select:{
      id:true,
      content:true,
      image:true,
      user:{
        select:{
          pseudo:true,
          avatar:true
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

  const festival = await prisma.festival.findMany()
  
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
          currentUserLikes: user.likes,
          festival
        }
      }
    }
  }
  return{
    props:{
      post: data,
      festival
    }
  }
}
