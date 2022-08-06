import React, {useState, useEffect} from 'react'
import { PrismaClient } from '@prisma/client'
import { parseCookies } from '../../helpers'
import Post from '../../components/Post'
import { useCookies } from 'react-cookie'
import { device } from '../../styles/device.css'
import styled from 'styled-components'
import Head from 'next/dist/shared/lib/head'

const PostContainer = styled.section`
.postContainer{
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: center;
  align-items: center;
  @media ${device.laptop}{
    padding: 140px 40px 40px 40px;
  }
}
`
export default function PostDetail({findPost}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [cookies] = useCookies(['user'])
    const [userLikes, setUserLikes] = useState([])

    useEffect(() => {
      setCurrentUser(cookies.user)
      {cookies.user &&
        fetch(`/api/post/userLikes`, {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: cookies.user?.id
          })
        }).then(res => res.json()).then(res => {
          setUserLikes(res.likes)
        })
      }
    }, [setUserLikes, cookies.user])
  return (
    <PostContainer>
      <Head>
        <title>Festiv-App | Page détails</title>
        <meta
            name="description"
            content="Festiv-App"
        />
      </Head>
      <div className='postContainer'>
        <Post data={findPost} currentUserId={currentUser?.id} setUserLikes={setUserLikes} userLikes={userLikes}/>
      </div>
    </PostContainer>
  )
}

export const getServerSideProps = async (context) => {
    let currentPost = context.query.post

    currentPost = parseInt(currentPost)
    try{
        const prisma = new PrismaClient()
        const findPost = await prisma.post.findUnique({
            where:{
                id:currentPost
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

        return{
            props:{
                findPost
            }
        }
    }catch(e){
        console.log(e)
    }
}
