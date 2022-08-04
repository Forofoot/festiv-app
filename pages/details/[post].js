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
export default function PostDetail({findPost, currentUserLikes}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [cookies] = useCookies(['user'])
    const [userLikes, setUserLikes] = useState([])

    useEffect(() => {
        let likesList = []

        setCurrentUser(cookies.user)
        
        if(currentUserLikes){
            currentUserLikes.map((elt,i) => {
              likesList.push(elt.post_id)
            })
          }
          
          setUserLikes(likesList)
    }, [cookies.user, currentUserLikes])
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
        <Post data={findPost} currentUserId={currentUser?.id} currentUserLikes={currentUserLikes}/>
      </div>
    </PostContainer>
  )
}

export const getServerSideProps = async (context) => {
    let currentPost = context.query.post
    const cookie = parseCookies(context.req)

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
        if(context.res){
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
                    findPost,
                    currentUserLikes: user.likes
                    }
                }
            }
        }

        return{
            props:{
                findPost
            }
        }
    }catch(e){
        console.log(e)
    }
}
