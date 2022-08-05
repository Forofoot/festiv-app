import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function Follow({currentUserId, following, follower, profileResult, profileLastName, profileFirstName, profileDescription, followingsLength, followersLength}) {
    const router = useRouter()
    const [isFollowed, setIsFollowed] = useState(null)
    const [isFollowing, setIsFollowing] = useState(null)
    const [totalFollows, setTotalFollows] = useState(followingsLength)

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
            {if(isFollowed){
                setTotalFollows(totalFollows - 1)
            }else{
                setTotalFollows(totalFollows + 1)
            }} 
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
        <div className="followStats">
            <div className="following">
                <p onClick={() =>handleShowFollowings()}>{totalFollows}</p>
                <p>Abonnés</p>
            </div>
            <span className="separator"></span>
            <div className="follower">
                <p onClick={() =>handleShowFollowers()}>{followersLength}</p>
                <p>Abonnements</p>
            </div>
        </div>
    
        
        <div className='accountName'>
            <h2>{profileFirstName} {profileLastName}</h2>
            <p className='btnPrimary' onClick={(e) => follow(e)}>{isFollowed ? (<span>Se désabonner</span>) : (
                <span>{isFollowing ? (<>S&apos;abonner en retour</>) : (<>S&apos;abonner</>)}</span>)}</p>
            
        </div>
        {profileDescription ? (
            <p>{profileDescription}</p>
        ) : (
            <p>Aucune description</p>
        )}
    </div>
  )
}
