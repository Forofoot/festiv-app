import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Head from "next/head";

export default function Profile({profile}){
    const [imageUploaded, setImageUploaded] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [currentUser, setCurrentUser] = useState(null)
    const [currentOptions, setCurrentOptions] = useState(null)
    const [inputedUser, setInputedUser] = useState({
        description: profile?.description,
        password: "",
    })
    const router = useRouter()

    const handleChange = (event) => {
        setImageUploaded(event.target.files[0]);
      };

    const handleModifyInfos = async(e) =>{
        e.preventDefault()
        try{
            toast.loading('Chargement en cours...')
            const formData = new FormData()
            formData.append("image", imageUploaded)
            formData.append("description", inputedUser.description)
            formData.append("password", inputedUser.password)
            formData.append("currentAvatar", profile?.avatarPublicId)
            formData.append("currentUserPseudo", profile?.pseudo)
            const res = await fetch('/api/profile/modify', {
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
        }catch(error){
            console.log(error)
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
    useEffect(() => {
        setCurrentUser(cookies.user)
    }, [cookies.user])

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
            <Toaster/>
            <h1>Page profile de {profile?.pseudo}</h1>
            {profile?.description &&(
                <p>{profile.description}</p>
            )}
            {profile?.pseudo  == currentUser?.pseudo && (
                <p onClick={() => setCurrentOptions(!currentOptions)}>
                    Modifier
                </p>
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

                        <label htmlFor="description">Description</label>
                        <textarea name="description" type="Text"  value={inputedUser.description || ''} placeholder='Description' onChange={(e) => setInputedUser({ ...inputedUser, description:e.target.value })}/>

                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" name="password" value={inputedUser.password || ""} placeholder='Mot de passe' minLength={8} onChange={(e) => setInputedUser({ ...inputedUser, password:e.target.value })}/>
                        
                        <button type='submit'>Modifier</button>
                    </form>
                    <p onClick={(e) => handleDeleteUser(e)}>Supprimer le compte</p>
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

export const getServerSideProps = async ({query}) => {
    const currentUser = query.pseudo
    try{
        const prisma = new PrismaClient()

        const profile = await prisma.user.findUnique({
            where:{
                pseudo: currentUser
            }
        })

        
        
        return{
            props:{
                profile
            }
        }
    }catch(e){
        console.log(e)
    }
}