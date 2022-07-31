import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function Like({liked, currentPost, currentUserId, likesCount}) {
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

    return (
    <div onClick={(event) => handleLike(event, currentPost, currentUserId)}>
        
            {totalLikes}
            
            <p>{!isLiked ? ('cest pas like') : ('cest like')}</p>
            
        
    </div>
  )
}
