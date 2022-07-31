import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Head from "next/head";
import { parseCookies } from "../../helpers";
import Follow from "../../components/Follow";

export default function Profile({profile, currentUserFollows}){
    const [imageUploaded, setImageUploaded] = useState();
    const [previewImage, setpreviewImage] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [currentUser, setCurrentUser] = useState(null)
    const [currentOptions, setCurrentOptions] = useState(null)
    const [currentShow, setCurrentShow] = useState(null)
    const [currentFollowings, setCurrentFollowings] = useState([])
    const [currentFollowers, setCurrentFollowers] = useState([])

    const [userFollows, setUserFollows] = useState([])
    const [userFollowers, setUserFollowers] = useState([])

    const router = useRouter()

    const handleChange = (event) => {
        setImageUploaded(event.target.files[0]);
        setpreviewImage(URL.createObjectURL(event.target.files[0]))
      };

    const handleModifyInfos = async(e) =>{
        e.preventDefault()
        toast.loading('Chargement en cours...')
        const formData = new FormData()
        formData.append("image", imageUploaded)
        const res = await fetch(`/api/profile/${profile?.pseudo}`, {
            method: 'POST',
            body: formData,
        })
        
        if(res.ok){
            const data = await res.json()
            toast.remove()
            setCookie("user", JSON.stringify(data), {
                path: '/',
                maxAge: 3600, // Expires after 1hr
                sameSite: true,
            })
            toast.success('Profil modifié')
            router.push(`/profile/${data.pseudo}`)
            setCurrentOptions(null)
        }else{
            toast.remove()
            toast.error('Erreur lors de la modification de vos infos')
        }
    }

    const handleDeleteUser = async(e) => {
        e.preventDefault()
        try{
            toast.loading('Suppression en cours...')
            const res = await fetch('/api/profile/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentUser: profile?.id
                }),
            })

            if(res.ok){
                toast.remove()
                toast.success('Compte supprimé')
                setCurrentUser(null)
                removeCookie('user',  {path: '/'})
                router.push('/')
            }else{
                toast.remove()
                toast.error('Erreur lors de la suppression de votre compte')
            }
        }catch(error){
            console.log(error)
        }
    }

    const handleShowFollowings = async(e) =>{
        setCurrentShow('showFollowings')
        console.log(currentFollowings)
        try{
            if(!currentFollowings.followings){
                const res = await fetch('/api/profile/showFollowings', {
                    method:'POST',
                    headers:{
                        'Content-Type':  'application/json'
                    },
                    body:JSON.stringify({
                        user: profile.id
                    })
                })
                const data = await res.json()
                if(res.ok){
                    if(data){
                        setCurrentFollowings(data)
                    }
                }else{
                    setCurrentShow(null)
                    toast.error('Erreur')
                }
            }
        }catch(e){
            console.log(e)
        }
    }

    const handleShowFollowers = async(e) =>{
        setCurrentShow('showFollowers')
        try{
            if(!currentFollowers.followers){
                const res = await fetch('/api/profile/showFollowers', {
                    method:'POST',
                    headers:{
                        'Content-Type':  'application/json'
                    },
                    body:JSON.stringify({
                        user: profile.id
                    })
                })
                const data = await res.json()
                if(res.ok){
                    if(data){
                        setCurrentFollowers(data)
                    }
                }else{
                    setCurrentShow(null)
                    toast.error('Erreur')
                }
            }
        }catch(e){
            console.log(e)
        }
    }
    useEffect(() => {
        let followersList = []
        let followsList = []

        setCurrentUser(cookies.user)
        setCurrentShow()
        setCurrentFollowers([])
        setCurrentFollowings([])

        if(currentUserFollows){
            currentUserFollows.followers.map((elt,i) => {
                followersList.push(elt.following_id)
            })
            currentUserFollows.followings.map((elt,i) => {
                followsList.push(elt.follower_id)
            })
        }

        setUserFollowers(followersList)
        setUserFollows(followsList)
    }, [cookies.user, router.asPath, currentUserFollows])

    return(
        <>
        <Head>
            <title>Festiv-App | Page profile</title>
            <meta
                name="description"
                content="Voici la page connexion de Festiv-app"
            />
        </Head>
        {profile?.pseudo ? (
            <>
            <h1>Page profile de {profile?.pseudo}  ( Abonné : <p onClick={() =>handleShowFollowings()}>{profile?.followings.length}</p> || Abonnement : <p onClick={() =>handleShowFollowers()}>{profile?.followers.length})</p></h1>

            {currentUserFollows && (
                <Follow profileResult={profile.id} follower={userFollowers.includes(profile.id)} following={userFollows.includes(profile.id)} currentUserId={currentUser?.id}/>
            )}
            
            {profile?.description &&(
                <p>{profile.description}</p>
            )}
            
            {profile?.pseudo  == currentUser?.pseudo && (
                <p onClick={() => setCurrentOptions(!currentOptions)}>
                    Modifier
                </p>
            )}

            {currentShow == 'showFollowings' && (
                <>
                    {currentFollowings ? (
                        <>
                            {currentFollowings.followings?.map((elt,i) => (
                                <div key={i}>
                                    <Link href={`/profile/${elt.follower.pseudo}`}>
                                        <a>
                                            {elt.follower.pseudo}
                                        </a>
                                    </Link>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            Chargement en cours...
                        </>
                    )}
                </>
            )}

            {currentShow == 'showFollowers' && (
                <>
                    {currentFollowers ? (
                        <>
                            {currentFollowers.followers?.map((elt,i) => (
                                <div key={i}>
                                    <Link href={`/profile/${elt.following.pseudo}`} onClick={() => handleRemoveAll()}>
                                        <a>
                                            {elt.following.pseudo}
                                        </a>
                                    </Link>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            Chargement en cours...
                        </>
                    )}
                </>
            )}

            {currentOptions === true &&(
                <>
                    <h2>Modifier le profil</h2>
                    <form onSubmit={handleModifyInfos}>

                        <label htmlFor='avatar'>Avatar</label>
                        <input
                            onChange={handleChange}
                            accept=".jpg, .png, .gif, .jpeg"
                            type="file"
                            id='file-input'
                            name="avatar"
                        ></input>
                        
                        <button type='submit'>Modifier</button>
                    </form>
                    <p onClick={(e) => handleDeleteUser(e)}>Supprimer le compte</p>
                    <img src={previewImage} width="500" height="500"/>
                </>
            )}
            </>
        ) : (
            <>
                <h1>Aucun profil ne correspond</h1>
                <Link href='/'>
                    <a>
                        Retour au menu
                    </a>
                </Link>
            </>
        )}
       
        </>
    )
}

export const getServerSideProps = async (context) => {
    const userResult = context.query.pseudo
    const cookie = parseCookies(context.req)

    try{
        const prisma = new PrismaClient()
        const profile = await prisma.user.findUnique({
            where:{
                pseudo: userResult
            },
            select:{
                id:true,
                pseudo:true,
                description:true,
                followings:true,
                followers:true,
            }
        })

        if(context.res){
            if(cookie.user){
                const parsedUser = JSON.parse(cookie.user)
                if(parsedUser.pseudo !== userResult){
                    const currentUserFollows = await prisma.user.findUnique({
                        where: {
                            pseudo: parsedUser.pseudo,
                        },
                        select:{
                            followers:{
                                select:{
                                    following_id:true
                                }
                            },
                            followings:{
                                select:{
                                    follower_id:true
                                }
                            },
                        }
                    })
                    return{
                        props:{
                            profile,
                            currentUserFollows
                        }
                    }
                }
            }
        }
        return{
            props:{
                profile
            }
        }
    }catch(e){
        console.log(e)
    }
}