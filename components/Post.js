import React, {useState, useEffect} from 'react'
import Like from './Like'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import Image from 'next/image'
import Moment from 'react-moment'
import 'moment/locale/fr';
import { device } from '../styles/device.css'

const PostStyle = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  background-color: var(--white);
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  flex-direction: column;
  @media ${device.laptop}{
    max-width: 840px;
    height: 450px;
    flex-direction: row;
  }
  .postImage{
    position: relative;
    flex: 1;
    min-width: 100%;
    min-height: 500px;
    @media ${device.laptop}{
      min-width: 50%;
      min-height: auto;
    }
  }
  .postDetails{
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 30px;
    min-width: 100%;
    padding: 25px;
    overflow: hidden;
    min-height: 420px;
    @media ${device.laptop}{
      min-width: 50%;
      min-height: auto;
    }
    .postedUser{
      display: flex;
      align-items: center;
      gap: 15px;
      div{
        overflow: hidden;
        border-radius: 50%;
        height: 48px;
        width: 48px;
      }
      p{
        font-size: 0.875rem;
      }
    }
    .actionBtn{
      display: flex;
      align-items: center;
    }
    .comments{
      
    position: relative;
      padding-top: 15px;
      border-top: 1px solid var(--primary);
      .commentHead{
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
      }
      .userComments{
        display: flex;
        flex-direction: column;
        gap: 20px;
        .userComment{
          display: flex;
          gap: 15px;
          align-items: flex-start;
          .userCommentsImg{
            height: 35px;
            width: 35px;
            border-radius: 50%;
            overflow: hidden;
          }
          .userCommentContent{
            div{
              display: flex;
              gap: 10px;
              margin-bottom: 5px;
              span{
                font-weight: bold;
              }
            }
            .date{
              font-weight: 400;
              font-size: 0.725rem;
              color: var(--greyDark);
            }
            .userCommentText{
              max-width: 220px;
              width: 100%;
              p{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
              }
            }
          }
        }
      }
    }
    .seeDetails{
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--secondary);
      }
  }
`

export default function Post({data, currentUserId, currentUserLikes}) {
    const [userLikes, setUserLikes] = useState([])

    const router = useRouter()
    
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
            currentUserId: currentUserId
          })
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

      useEffect(() => {
        let likesList = []
    
        if(currentUserLikes){
          currentUserLikes.map((elt,i) => {
            likesList.push(elt.post_id)
          })
        }
        
        setUserLikes(likesList)
      }, [currentUserLikes])
    return (
        <PostStyle className='post'>
            <div className='postImage'>
              <Image
                src={'/placeholder.webp'}
                alt="Image du post"
                layout='fill'
                objectFit='cover'
              />
            </div>
            <div className='postDetails'>
              <div className='postedUser'>
                <div>
                  <Image
                    src={'/placeholder.webp'}
                    alt='Photo de profile'
                    width={48}
                    height={48}
                  />
                </div>
                <p>
                  <Link href={`/profile/${data.user?.pseudo}`}>
                    <a>
                      {data.user?.pseudo}
                    </a>
                  </Link>
                </p>
              </div>
              <p className='description'>{data.description}</p>

              <div className='actionBtn'>
                  <Like currentPost={data.id} likesCount={data.likes.length} currentPostContent={data.content} currentPostDescription={data.description} currentUserId={currentUserId} liked={userLikes.includes(data.id) ? true : false}/>
              </div>
              
              {/*<p>{data.festival?.title}</p>*/}
              <div className='comments'>
                <p className='commentHead'>Commentaires</p>
                <div className='userComments'>
                {data.comments?.map((com,index) => (
                    <div className='userComment' key={index}>
                      <div className='userCommentsImg'>
                      {com.user.avatar ? (
                          <Image
                            src={com?.user.avatar}
                            alt={`Photo de ${com?.user.pseudo}`}
                            width={35}
                            height={35}
                          />
                        ) : (
                          <Image
                            src={'/profile/avatar.webp'}
                            alt="Avatar"
                            width={35}
                            height={35}
                            objectFit='cover'
                          />
                        )}
                      </div>
                      <div className='userCommentContent'>
                        <div>
                          <span>{com.user.pseudo}</span>
                          <div className='userCommentText'>
                            <p>
                              {com.content}
                            </p>
                          </div>
                        </div>
                        <span className='date'><Moment locale="fr" date={com.updatedAt} fromNow /></span>
                      </div>
                    </div>
                ))}
                </div>
              </div>
              
              {/*<p onClick={() => handleDeletePost(data.id)}>Supprimer</p>*/}

              {/*<p>Ajouter un commentaire : </p>
              <form onSubmit={(event) => handleAddComment(event, data.id)}>
                  <input type="text" placeholder='Commentaire' name='comment'/>
              </form>*/}

              <Link href={`/details/${data.id}`}><a className='seeDetails'>Voir les détails</a></Link>
            </div>
        </PostStyle>
  )
}
