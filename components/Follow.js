import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function Follow({currentUserId, following, follower, profileResult}) {
    const router = useRouter()
    const [isFollowed, setIsFollowed] = useState(null)
    const [isFollowing, setIsFollowing] = useState(null)

    useEffect(() => {
        setIsFollowed(follower)
        setIsFollowing(following)
    }, [follower, following])
    const follow = async(e) => {
        e.preventDefault()
        if(!currentUserId){
            toast.error('Veuillez vous connecter')
            router.push('/auth/signin')
        }else{
            setIsFollowed(!isFollowed)
            {/*if(isFollowed){
                setTotalLikes(totalLikes + 1)
            }else{
                setTotalLikes(totalLikes - 1)
            }*/}
            const res = await fetch(`/api/profile/follow`, {
                method:'POST',
                headers:{
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                id: profileResult,
                currentUser: currentUserId
                })
            })
            if(res.ok){
                console.log('suivi')
            }else{
                setIsLiked(!following)
            }
        }
    }

    return (
    <div>
            
            <p onClick={(e) => follow(e)}>{isFollowed ? ('Se désabonner') : ('S\'abonner')} {isFollowing &&(<span>Vous suit</span>)}</p>

    </div>
  )
}
