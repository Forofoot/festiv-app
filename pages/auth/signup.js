import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Signup () {
    const [inputedUser, setInputedUser] = useState({
        email: "",
        pseudo: "",
        firstName: "",
        lastName: "",
        password: ""
    })

    const router = useRouter()
    
    const [cookies, setCookie, removeCookie] = useCookies()

    const handleCreateUser = async (e) =>{
        e.preventDefault()
        try{
            toast.loading('Inscription en cours...')
            if (!inputedUser.email || !inputedUser.email.includes('@') || !inputedUser.password || !inputedUser.firstName || !inputedUser.lastName || !inputedUser.pseudo) {
                toast.remove()
                toast.error('Informations incorrectes')
            }else{
                //POST form values
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: inputedUser.email,
                        pseudo: inputedUser.pseudo,
                        firstName: inputedUser.firstName,
                        lastName: inputedUser.lastName,
                        password: inputedUser.password,
                    }),
                });
                
                const data = await res.json();

                if(res.ok){
                    toast.remove()
                    toast.success('Compte créé')
                    setCookie("user", JSON.stringify(data), {
                        path: '/',
                        maxAge: 3600, // Expires after 1hr
                        sameSite: true,
                    })
                    router.push('/')
                    toast.success('Connecté')
                }else{
                    toast.remove()
                    toast.error('Erreur lors de la création du compte')
                }
            }
        }catch(error){
            console.log(error)
        }
    }
    return(
        <>
            <Head>
                <title>Festiv-App | Inscription</title>
                <meta
                    name="description"
                    content="Voici la page d'inscription de Festiv-app"
                />
            </Head>
            <Toaster/>
            <h1>S&apos;inscrire</h1>

            <form method='POST' onSubmit={handleCreateUser}>
                <label>Email</label>
                <input type="text" value={inputedUser.email || ""} placeholder='email' onChange={(e) => setInputedUser({ ...inputedUser, email:e.target.value })}/>
                <label>Pseudo</label>
                <input type="text" value={inputedUser.pseudo || ""} placeholder='pseudo' onChange={(e) => setInputedUser({ ...inputedUser, pseudo:e.target.value })}/>
                <label>Prénom</label>
                <input type="text" value={inputedUser.firstName || ""} placeholder='Prénom' onChange={(e) => setInputedUser({ ...inputedUser, firstName:e.target.value })}/>
                <label>Nom</label>
                <input type="text" value={inputedUser.lastName || ""} placeholder='Nom' onChange={(e) => setInputedUser({ ...inputedUser, lastName:e.target.value })}/>
                <label>Mot de passe</label>
                <input type="password"  value={inputedUser.password || ""} placeholder='Mot de passe' minLength={8} onChange={(e) => setInputedUser({ ...inputedUser, password:e.target.value })}/>
                <button type='submit' className="btnPrimary btnMore hoverEffect">S&apos;inscrire</button>
            </form>
        </>
    )
}