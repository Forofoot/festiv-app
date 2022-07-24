import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { Prisma, PrismaClient } from '@prisma/client'
import { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function Profile({profile}){
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [currentUser, setCurrentUser] = useState(null)
    const [currentOptions, setCurrentOptions] = useState(null)
    const [inputedUser, setInputedUser] = useState({
        email: profile?.email,
        pseudo: profile?.pseudo,
        description: profile?.description,
        password: "",
    })
    const router = useRouter()

    const handleModifyInfos = async(e) =>{
        e.preventDefault()
        try{
            toast.loading('Chargement en cours...')
            if(!inputedUser.email || !inputedUser.email.includes('@') || !inputedUser.pseudo){
                toast.remove()
                toast.error('Erreur lors de la modification')
            }else{
                const res = await fetch('/api/profile/modify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: inputedUser.email,
                        pseudo: inputedUser.pseudo,
                        description: inputedUser.description,
                        password: inputedUser.password,
                        currentUserPseudo: profile?.pseudo
                    }),
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
                        <label htmlFor="email">Email</label>
                        <input name="email" type="Text"  value={inputedUser.email || ''} placeholder='Email' onChange={(e) => setInputedUser({ ...inputedUser, email:e.target.value })}/>

                        <label htmlFor="pseudo">Pseudo</label>
                        <input name="pseudo" type="Text"  value={inputedUser.pseudo || ''} placeholder='Pseudo' onChange={(e) => setInputedUser({ ...inputedUser, pseudo:e.target.value })}/>

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

        await prisma.$disconnect()
        
        return{
            props:{
                profile
            }
        }
    }catch(e){
        console.log(e)
    }
}