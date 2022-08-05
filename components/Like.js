import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import Image from 'next/image'

const LikesStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .total{
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .likesActions{
        display: flex;
        gap: 5px;
        align-items: center;
    }
    .share{
        display: flex;
        cursor: pointer;
    }
`

export default function Like({liked, currentPost, currentUserId, likesCount, currentPostDescription, currentPostContent, ifNavigator, totalComments}) {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(liked)
    const [totalLikes, setTotalLikes] = useState(likesCount)
    
    useEffect(() => {
        setIsLiked(liked)
    }, [liked])
    const handleLike = async(e, currentPost, currentUserId) => {
        e.preventDefault()
        if(!currentUserId){
            toast.error('Veuillez vous connecter')
            router.push('/auth/')
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
        if(navigator.share){
            navigator.share({
                title: title,
                text: description,
                url: '/details/'+id
            })
        }
    }

    return (
    <LikesStyle>
            <div className='likesActions'>
                <div onClick={(event) => handleLike(event, currentPost, currentUserId)}>{!isLiked ? (
                    <svg className="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                    <g className="Group" fill="none" transform="translate(467 392)">
                    <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" className="heart" fill="#AAB8C2"/>
                    <circle className="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>
            
                    <g className="grp7" opacity="0" transform="translate(7 6)">
                        <circle className="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
                        <circle className="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
                    </g>
            
                    <g className="grp6" opacity="0" transform="translate(0 28)">
                        <circle className="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
                        <circle className="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
                    </g>
            
                    <g className="grp3" opacity="0" transform="translate(52 28)">
                        <circle className="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
                        <circle className="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
                    </g>
            
                    <g className="grp2" opacity="0" transform="translate(44 6)">
                        <circle className="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
                        <circle className="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
                    </g>
            
                    <g className="grp5" opacity="0" transform="translate(14 50)">
                        <circle className="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
                        <circle className="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
                    </g>
            
                    <g className="grp4" opacity="0" transform="translate(35 50)">
                        <circle className="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
                        <circle className="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
                    </g>
            
                    <g className="grp1" opacity="0" transform="translate(24)">
                        <circle className="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
                        <circle className="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
                    </g>
                    </g>
                    </svg>
                    ) : (
                    <svg className="heart-svg liked" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                    <g className="Group" fill="none" transform="translate(467 392)">
                    <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" className="heart" fill="#AAB8C2"/>
                    <circle className="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>
            
                    <g className="grp7" opacity="0" transform="translate(7 6)">
                        <circle className="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
                        <circle className="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
                    </g>
            
                    <g className="grp6" opacity="0" transform="translate(0 28)">
                        <circle className="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
                        <circle className="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
                    </g>
            
                    <g className="grp3" opacity="0" transform="translate(52 28)">
                        <circle className="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
                        <circle className="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
                    </g>
            
                    <g className="grp2" opacity="0" transform="translate(44 6)">
                        <circle className="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
                        <circle className="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
                    </g>
            
                    <g className="grp5" opacity="0" transform="translate(14 50)">
                        <circle className="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
                        <circle className="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
                    </g>
            
                    <g className="grp4" opacity="0" transform="translate(35 50)">
                        <circle className="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
                        <circle className="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
                    </g>
            
                    <g className="grp1" opacity="0" transform="translate(24)">
                        <circle className="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
                        <circle className="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
                    </g>
                    </g>
                    </svg>
                )}
                </div>
                {ifNavigator ? (<div className='share' onClick={(event) => handleShare(event, currentPost, currentPostContent, currentPostDescription)}>
                    <Image src={'/post/share.svg'} alt="share" width={30} height={30} className="share-icon" />
                </div>) : ('')}
            </div>
            
            <div className='total'><span>{totalLikes} {totalLikes === 1 || totalLikes === 0 ? ('j\'aime') : ('j\'aimes')}</span>  <span>{totalComments} {totalComments === 1 || totalComments === 0 ? ('commentaire') : ('commentaires')}</span></div>
    </LikesStyle>
  )
}
