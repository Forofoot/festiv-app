import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Head from "next/head";
import { parseCookies } from "../../helpers";
import Follow from "../../components/Follow";
import styled from "styled-components";
import Image from "next/dist/client/image";
import {device} from '../../styles/device.css'

const ProfileStyle = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    position: relative;
    @media ${device.desktop}{
        flex-direction:row;
    }
    .modify{
        margin-top: 20px;
        text-align: right;
        @media ${device.desktop}{
            position: absolute;
            margin-top: 0;
            left: 40px;
            top: 40px;
        }
    }
    .profileContainer{
        padding: 40px 25px;
        max-width: 840px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        width: 100%;
        border-radius: 20px;
        background-color: var(--white);
        &.modifyContainer{
            background: transparent;
            box-shadow: none;
            .preview{
                object-fit: cover;
            }
        }
        h1{
            text-align: center;
            color: var(--secondary);
            margin-bottom: 20px;
        }
        h2{
            color:var(--secondary);
            margin-bottom: 10px;
        }
        .btnPrimary{
            input{
                display: none;
            }
        }
        .infoBlock{
            margin-bottom: 50px;
            .accountName{
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 15px;
                h2{
                    margin-bottom: 0;
                }
                .btnPrimary{
                    padding: 10px;
                }
            }
            .profilePicture{
                text-align: center;
                border-radius: 50%;
                overflow: hidden;
                width: 217px;
                height: 217px;
                margin: auto;
                margin-bottom: 20px;
            }
            .followStats{
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 40px;
                margin-bottom: 20px;
                .following,
                .follower{
                    text-align: center;
                    font-weight: bold;
                    position: relative;
                    width: 20%;
                    cursor: pointer;
                }
                .separator{
                    width: 2px;
                    height: 25px;
                    background:var(--primary);
                }
            }
        }
    }
`

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
            <ProfileStyle>
                <div className={`profileContainer ${currentOptions ? 'modifyContainer' : ''}`}>
                    {profile?.pseudo ? (
                        <>
                            {currentOptions ? (
                                <div className="infoBlock">
                                    <h1>Modifier le profil</h1>

                                    <div className="profilePicture">
                                        {previewImage ? (
                                            <img className="preview" src={previewImage} alt="Prévisualitation de l'image" width={217} height={217}/>
                                        ) : (
                                            <>
                                            {profile.avatar ? (
                                                <Image
                                                    src={`${profile?.avatar}`}
                                                    alt="Photo de profil"
                                                    width={217}
                                                    height={217}
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <Image
                                                    src={'/profile/avatar.webp'}
                                                    alt="Photo de profil"
                                                    width={217}
                                                    height={217}
                                                    objectFit="cover"
                                                />
                                            )} 
                                            </>
                                        )}
                                        
                                    </div>

                                    <form onSubmit={handleModifyInfos}>

                                        <label className="btnPrimary">
                                            <span>Changer de photo</span>
                                            <input
                                                onChange={handleChange}
                                                accept=".jpg, .png, .gif, .jpeg"
                                                type="file"
                                                id='file-input'
                                                name="avatar"
                                            ></input>
                                        </label>
                                        {previewImage && (
                                            <button className="btnPrimary" type='submit'><span>Modifier</span></button>
                                        )}
                                    </form>
                                    Ajouter modal DIAAAAAAALOOOOOOOOOOOOOOOOOOOOOOOOG
                                    <p onClick={(e) => handleDeleteUser(e)}>Supprimer le compte</p>
                                </div>) : (
                            <>        
                            <div className="infoBlock">
                                <h1>{profile?.pseudo} </h1>

                                <div className="profilePicture">
                                    {profile.avatar ? (
                                        <Image
                                            src={`${profile?.avatar}`}
                                            alt="Photo de profil"
                                            width={217}
                                            height={217}
                                            objectFit="cover"
                                        />
                                    ) : (
                                        <Image
                                            src={'/profile/avatar.webp'}
                                            alt="Photo de profil"
                                            width={217}
                                            height={217}
                                            objectFit="cover"
                                        />
                                    )} 
                                </div>

                                {!currentUserFollows ? (
                                    <>
                                        <div className="followStats">
                                            <div className="following">
                                                <p onClick={() =>handleShowFollowings()}>{profile?.followings.length}</p>
                                                <p>Abonnés</p>
                                            </div>
                                            <span className="separator"></span>
                                            <div className="follower">
                                                <p onClick={() =>handleShowFollowers()}>{profile?.followers.length}</p>
                                                <p>Abonnements</p>
                                            </div>
                                        </div>
                                    
                                        

                                        <h2>{profile.firstName} {profile.lastName}</h2>
                                        {profile?.description ? (
                                            <p>{profile.description}</p>
                                        ) : (
                                            <p>Aucune description</p>
                                        )}
                                    </>
                                ) : (
                                    <Follow profileResult={profile.id} follower={userFollowers.includes(profile.id)} following={userFollows.includes(profile.id)} currentUserId={currentUser?.id} profileDescription={profile?.description} profileFirstName={profile.firstName} profileLastName={profile.lastName} followersLength={profile?.followers.length}
                                    followingsLength={profile?.followings.length}/>
                                )}
                            </div>

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
                </div>
                {profile?.pseudo  == currentUser?.pseudo && (
                    <p className="btnPrimary modify" onClick={() => setCurrentOptions(!currentOptions)}>
                        <span>Modifier</span>
                    </p>
                )}
            </ProfileStyle>
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
                avatar:true,
                description:true,
                firstName:true,
                lastName:true,
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