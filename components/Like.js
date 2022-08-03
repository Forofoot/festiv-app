import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import styled from 'styled-components'

const LikesStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .totalLikes{
        font-weight: bold;
    }
    .likesActions{
        display: flex;
        gap: 5px;
        align-items: center;
    }
`

export default function Like({liked, currentPost, currentUserId, likesCount, currentPostDescription, currentPostContent}) {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(null)
    const [totalLikes, setTotalLikes] = useState(likesCount)

    useEffect(() => {
        setIsLiked(liked)
    }, [liked])
    const handleLike = async(e, currentPost, currentUserId) => {
        e.preventDefault()
        if(!currentUserId){
            toast.error('Veuillez vous connecter')
            router.push('/auth/signin')
        }else{
            setIsLiked(!isLiked)
            if(!isLiked){
                setTotalLikes(totalLikes + 1)
            }else{
                setTotalLikes(totalLikes - 1)
            }
            const res = await fetch(`/api/post/like`, {
                method:'POST',
                headers:{
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                id: currentPost,
                currentUser: currentUserId
                })
            })
            if(res.ok){
                console.log('liké')
            }else{
                setIsLiked(!liked)
            }
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

    return (
    <LikesStyle onClick={(event) => handleLike(event, currentPost, currentUserId)}>
            <div className='likesActions'>
                <p>{!isLiked ? ('cest pas like') : ('cest like')}</p>
                
                <p onClick={(event) => handleShare(event, currentPost, currentPostContent, currentPostDescription)}>Partager</p>
            </div>
            
            <span className='totalLikes'>{totalLikes} {totalLikes === 1 || totalLikes === 0 ? ('j\'aime') : ('j\'aimes')}</span>
    </LikesStyle>
  )
}
