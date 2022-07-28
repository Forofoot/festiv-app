import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/dist/client/router'
import styled from 'styled-components'
import Like from '../components/Like'
import { parseCookies } from "../helpers"

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

  const handleDeletePost = async(id) => {
    const res = await fetch(`/api/post/deletePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:id
      })
    })
    if(res.ok){
      router.replace(router.asPath) 
    }
  }
  const handleAddComment = async(e,id) => {
    e.preventDefault()
    const res = await fetch(`/api/post/addComment`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:id,
        commentContent:e.target.comment.value,
        currentUserId: currentUser?.id
      })
    })
    if(res.ok){
      router.replace(router.asPath)
    }
  }

  useEffect(() => {
    setCurrentUser(cookies.user)
    let likesList = []

    if(currentUserLikes){
      currentUserLikes.map((elt,i) => {
        likesList.push(elt.post_id)
      })
    }
    
    setUserLikes(likesList)
  }, [cookies.user, currentUserLikes])

  console.log(userLikes)
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
      
      <h2>Bonjour {currentUser?.pseudo}</h2>
      <p>Nom des festivaliers</p>
      <p onClick={handleAddPost}>Ajouter un festival</p>
      <div className='postContainer'>
        {post.map((elt, i) =>(
          <div className='post' key={i}>
            <p>{elt.content}</p>
            <p>{elt.description}</p>
            <p>{elt.festival.title}</p>
            <p>De {elt.user.pseudo}</p>
            {elt.comments.map((com,index) => (
              <p key={index}>{com.content}</p>
            ))}
            <p onClick={() => handleDeletePost(elt.id)}>Supprimer</p>

            <p>Ajouter un commentaire : </p>
            <form onSubmit={(event) => handleAddComment(event, elt.id)}>
              <input type="text" placeholder='Commentaire' name='comment'/>
            </form>
            
              <div>
                    <Like currentPost={elt.id} likesCount={elt.likes.length} currentUserId={currentUser?.id} liked={userLikes.includes(elt.id) ? true : false}/>
                    {/*lik.user.pseudo === currentUser?.pseudo ? (
                      <p onClick={(event) => handleLike(event, elt.id, currentUser.pseudo)}>c&apos;est like</p>
                    ) : (
                      <p onClick={(event) => handleCreateLike(event, elt.id, currentUser.pseudo)}>c&apos;est pas like</p>
                    )
                    */}
              </div>
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
