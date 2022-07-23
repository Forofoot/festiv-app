import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';

export default function Profile({profile}){
    return(
        <h1>Page profile de </h1>
    )
}

export const getServerSideProps = async ({query}) => {
    const currentUser = query.pseudo
    try{
        console.log(currentUser)
    }catch(e){
        console.log(e)
    }
}