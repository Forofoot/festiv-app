import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { Prisma, PrismaClient } from '@prisma/client'
import { useState, useEffect } from "react";

export default function Profile({profile}){
    const [cookies] = useCookies(['user'])
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        setCurrentUser(cookies.user)
    }, [cookies.user])

    return(
        <>
        <h1>Page profile de {profile?.pseudo}</h1>
        {profile?.pseudo  == currentUser?.pseudo ? (
            <p>Oui</p>
        ) : 
        (
           <p>Non</p> 
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