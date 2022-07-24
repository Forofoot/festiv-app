import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Signin () {
    const [inputedUser, setInputedUser] = useState({
        email: "",
        password: ""
    })

    const router = useRouter()
    
    const [cookies, setCookie, removeCookie] = useCookies()

    const handleConnectUser = async (e) =>{
        e.preventDefault()
        try{
            toast.loading('Connexion en cours...')
            if (!inputedUser.email || !inputedUser.email.includes('@') || !inputedUser.password) {
                toast.remove()
                toast.error('Informations incorrectes')
            }else{
                //POST form values
                const res = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: inputedUser.email,
                        password: inputedUser.password
                    }),
                });
                
                const data = await res.json();

                if(res.ok){
                    setCookie("user", JSON.stringify(data), {
                        path: '/',
                        maxAge: 3600, // Expires after 1hr
                        sameSite: true,
                    })
                    toast.remove()
                    toast.success('Connecté')
                    router.push('/')
                }else{
                    toast.remove()
                    toast.error('Erreur lors de la connexion au compte')
                }
            }
        }catch(error){
            console.log(error)
        }
    }
    return(
        <>
            <Head>
                <title>Festiv-App | Connexion</title>
                <meta
                    name="description"
                    content="Voici la page connexion de Festiv-app"
                />
            </Head>
            <Toaster/>
            <h1>Se connecter</h1>

            <form method='POST' onSubmit={handleConnectUser}>
                <label>Email</label>
                <input type="text" value={inputedUser.email || ""} placeholder='email' onChange={(e) => setInputedUser({ ...inputedUser, email:e.target.value })}/>
                <input type="password"  value={inputedUser.password || ""} placeholder='Mot de passe' minLength={8} onChange={(e) => setInputedUser({ ...inputedUser, password:e.target.value })}/>
                <button type='submit' className="btnPrimary btnMore hoverEffect">Se connecter</button>
            </form>
        </>
    )
}