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
import Modal from "../../components/Modal";
import Modify from "../../components/Modify"

const ProfileStyle = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    position: relative;
    @media ${device.desktop}{
        flex-direction:row;
        padding: 40px;
    }
    .modify{
        text-align: right;
        margin-bottom: 20px;
        margin-left: auto;
        margin-right: auto;
        @media ${device.desktop}{
            position: absolute;
            margin-top: 0 ;
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
            padding: 0;
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
            .formImage{
                margin-bottom: 50px;
            }
            .grid{
                display: grid;
                grid-gap: 20px;
                grid-template-columns: repeat(1, 1fr);
                grid-template-rows: repeat(1, 1fr);
                margin-bottom: 40px;
                @media ${device.mobile}{
                    margin-bottom: 115px;
                    gap: 40px;
                    grid-template-columns: repeat(2, 1fr);
                    grid-template-rows: repeat(2, 1fr);
                   .informationsBlock{
                        grid-area: 1 / 1 / 3 / 2;
                    } 
                }
                .modifyBlock{
                    background-color: var(--white);
                    border-radius: 20px;
                    padding: 20px 20px 40px 20px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                    @media ${device.mobile}{
                        padding: 30px 25px;
                    }
                    h2{
                        text-transform: uppercase;
                        color: var(--primary);
                        font-size: 1rem;
                        margin-bottom: 0;
                    }
                    .label{
                        p{
                            font-size: 0.875rem;
                            color: var(--secondary);
                            font-weight: bold;
                        }
                        span,
                        .descriptionText{
                            font-size: 0.725rem;
                            color: var(--primary);
                            font-weight: 400;
                            margin-bottom: 0;
                        }
                        .descriptionText{
                            margin-top: 5px;
                        }
                    }
                    .modifyLabel{
                        position: absolute;
                        font-size: 0.725rem;
                        bottom: 10px;
                        right: 20px;
                        color: var(--green);
                        text-transform: uppercase;
                        cursor: pointer;
                        @media ${device.mobile}{
                            top: 30px;
                            right: 25px;
                        }
                    }
                }
            }
        }
    }
`

export default function Profile({profile, currentUserFollows}){
    const [cookies] = useCookies(['user'])
    const [previewImage, setpreviewImage] = useState();
    const [currentUser, setCurrentUser] = useState(null)
    const [currentOptions, setCurrentOptions] = useState(null)
    const [currentShow, setCurrentShow] = useState(null)
    const [currentFollowings, setCurrentFollowings] = useState([])
    const [currentFollowers, setCurrentFollowers] = useState([])
    const [modalOptions, setModalOptions] = useState()

    const [userFollows, setUserFollows] = useState([])
    const [userFollowers, setUserFollowers] = useState([])

    const [opened, setOpened] = useState(false)
    const router = useRouter()

    const handleShowFollowings = async(e) =>{
        setCurrentShow('showFollowings')
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
            <Modal profileDescription={profile?.description} profileId={profile?.id} setOpened={setOpened} isopened={opened} setModalOptions={setModalOptions} modalOptions={modalOptions}/>
            <ProfileStyle>
                <div className={`profileContainer ${currentOptions ? 'modifyContainer' : ''}`}>
                    {profile?.pseudo  == currentUser?.pseudo && (
                        <p className="btnPrimary modify" onClick={() => setCurrentOptions(!currentOptions)}>
                            <span>{currentOptions ? 'Retour' : 'Modifier'}</span>
                        </p>
                    )}
                    {profile?.pseudo ? (
                        <>
                            {currentOptions ? (
                                <Modify previewImage={previewImage} setpreviewImage={setpreviewImage} profileAvatar={profile?.avatar} profilePseudo={profile?.pseudo} profileId={profile?.id} setCurrentUser={setCurrentUser} setOpened={setOpened} profileFirstName={profile?.firstName} profileLastName={profile?.lastName} profileEmail={profile?.email} profileDescription={profile?.description} setModalOptions={setModalOptions} modalOptions={modalOptions}/>
                                ) : (
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
                email:true,
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