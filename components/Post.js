import React, {useState, useEffect} from 'react'
import Like from './Like'
import { useRouter } from 'next/router'
import Link from 'next/link'

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

    const handleShare = (e,id, title, description) =>{
        e.preventDefault()
        navigator.share({
            title: title,
            text: description,
            url: '/details/'+id
        })
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
        <div className='post'>

            <p>{data.content}</p>
            <p>{data.description}</p>
            <p>{data.festival?.title}</p>
            <p>De {data.user?.pseudo}</p>
            {data.comments?.map((com,index) => (
                <p key={index}>{com.content}</p>
            ))}
            <p onClick={() => handleDeletePost(data.id)}>Supprimer</p>

            <p>Ajouter un commentaire : </p>
            <form onSubmit={(event) => handleAddComment(event, data.id)}>
                <input type="text" placeholder='Commentaire' name='comment'/>
            </form>
            
            <div>
                <Like currentPost={data.id} likesCount={data.likes.length} currentUserId={currentUserId} liked={userLikes.includes(data.id) ? true : false}/>
            </div>

            <div>
                <p onClick={(event) => handleShare(event, data.id, data.content, data.description)}>Partager</p>
            </div>
            <Link href={`/details/${data.id}`}><a>Voir les détails</a></Link>
        </div>
  )
}
