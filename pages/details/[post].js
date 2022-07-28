import React, {useState, useEffect} from 'react'
import { PrismaClient } from '@prisma/client'
import { parseCookies } from '../../helpers'
import Post from '../../components/Post'
import { useCookies } from 'react-cookie'

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
    <div>
        <Post data={findPost} currentUserId={currentUser?.id} currentUserLikes={currentUserLikes}/>  
    </div>
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
