import { useState } from "react"
import toast from 'react-hot-toast';
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/dist/client/image";
import styled from "styled-components";
import { device } from "../../styles/device.css";

const AuthStyle = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: calc(100vh);
    .imgCover{
        display: none!important;
        @media ${device.mobile}{
            display: block!important;
        }
    }
    .authContainer{
        width: 100%;
        height: 100%;
        background: var(--white);
        padding: 50px 20px;
        z-index: 5;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: scroll;
        @media ${device.mobile}{
            height: 80%;
            border-radius: 20px;
            max-width: 650px;
            padding: 80px 120px;
            overflow: hidden;
        }

        h1{
            text-align: center;
            text-transform: uppercase;
            margin-bottom: 50px;
        }
        .authNavigation{
            display: flex;
            justify-content: center;
            margin-bottom: 50px;
            & > * {
                flex: 1;
                cursor: pointer;
                text-align: center;
                opacity: .7;
                padding-bottom: 15px;
                &::after{
                    content:'';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    transform: scaleX(0);
                    transform-origin: right;
                    transition: transform .2s linear;
                }
                &:last-child{
                    &::after{
                        transform-origin: left;
                    }
                }
            }
            .active{
                opacity: 1;
                font-weight: bold;
                position: relative;
                &::after{
                    width: 100%;
                    height: 3px;
                    background: var(--secondary);
                    transform: scaleX(1);
                    @media ${device.mobile}{
                        height: 5px;
                    }
                }
            }
        }
        form{
            flex: 1;
            justify-content: center;
            position: relative;
            margin-bottom: 15px;
            .formContainer,
            .formInput{
                width: 100%;
                &.name{
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    @media ${device.mobile} {
                        gap: 40px;
                        flex-direction: row;
                    }
                    & > *{
                        flex: 1;
                    }
                }
            }
            .formContainer{
                display: flex;
                flex-direction: column;
                gap: 15px;
                .showPassword{
                    position: relative;
                    label{
                        cursor: pointer;
                        width: auto;
                    }
                                        
                    .toggle {
                        isolation: isolate;
                        position: absolute;
                        right: 0;
                        top: 0;
                        height: 20px;
                        width: 40px;
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow:
                            -8px -4px 8px 0px #ffffff,
                            8px 4px 12px 0px #d1d9e6,
                            4px 4px 4px 0px #d1d9e6 inset,
                            -4px -4px 4px 0px #ffffff inset;
                    }

                    .toggle-state {
                        display: none;
                    }

                    .indicator {
                        height: 100%;
                        width: 200%;
                        background: linear-gradient(90.32deg, #6300B1 8.05%, #002762 82.81%);
                        border-radius: 15px;
                        transform: translate3d(-75%, 0, 0);
                        transition: transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35);
                        box-shadow:
                            -8px -4px 8px 0px #ffffff,
                            8px 4px 12px 0px #d1d9e6;
                    }

                    .toggle-state:checked ~ .indicator {
                        transform: translate3d(25%, 0, 0);
                    }
                }
            }
            button{
                margin-top: auto;
            }
        }
        .btnPrimary{
            width: 100%;
        }
        .alreadyAccount{
            width: 100%;
            text-align: center;
            .connectLink{
                color: var(--secondary);
                cursor:pointer;
            }
        }
    }

`

export default function Signin () {
    const [inputedUser, setInputedUser] = useState({
        email: "",
        password: ""
    })

    
    const [inputedUserSignup, setInputedUserSignup] = useState({
        email: "",
        pseudo: "",
        firstName: "",
        lastName: "",
        password: ""
    })

    const router = useRouter()
    
    const [cookies, setCookie, removeCookie] = useCookies()

    const [showPassword, setShowPassword] = useState(false)

    const [authMethod, setAuthMethod] = useState('signin')

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

    const handleCreateUser = async (e) =>{
        e.preventDefault()
        try{
            toast.loading('Inscription en cours...')
            if (!inputedUserSignup.email || !inputedUserSignup.email.includes('@') || !inputedUserSignup.password || !inputedUserSignup.firstName || !inputedUserSignup.lastName || !inputedUserSignup.pseudo) {
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
                        email: inputedUserSignup.email,
                        pseudo: inputedUserSignup.pseudo,
                        firstName: inputedUserSignup.firstName,
                        lastName: inputedUserSignup.lastName,
                        password: inputedUserSignup.password,
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
        <AuthStyle>
            <Head>
                <title>Festiv-App | Connexion</title>
                <meta
                    name="description"
                    content="Voici la page connexion de Festiv-app"
                />
            </Head>
            <Image
                src={'/auth/bg-auth.webp'}
                alt="Image de fond"
                layout="fill"
                objectFit="cover"
                className="imgCover"
            />

            <div className="authContainer">
                <h1>Créer un compte</h1>
                <div className="authNavigation">
                    <p onClick={() => setAuthMethod('signup')} className={`${authMethod === 'signup' ? ('active') : ('')}`}>Créer un compte</p>
                    <p onClick={() => setAuthMethod('signin')} className={`${authMethod === 'signin' ? ('active') : ('')}`}>Connexion</p>
                </div>
                {authMethod === 'signup' ? (
                    <>
                    <form method='POST' onSubmit={handleCreateUser}>
                        <div className="formContainer">
                            <div className="formInput name">
                                <div>
                                    <label>Prénom</label>
                                    <input type="text" value={inputedUserSignup.firstName || ""} placeholder='Prénom' onChange={(e) => setInputedUserSignup({ ...inputedUserSignup, firstName:e.target.value })}/>
                                </div>
                                <div>
                                    <label>Nom</label>
                                    <input type="text" value={inputedUserSignup.lastName || ""} placeholder='Nom' onChange={(e) => setInputedUserSignup({ ...inputedUserSignup, lastName:e.target.value })}/>
                                </div>
                            </div>

                            <div className="formInput">
                                <label>Email</label>
                                <input type="email" value={inputedUserSignup.email || ""} placeholder='email' onChange={(e) => setInputedUserSignup({ ...inputedUserSignup, email:e.target.value })}/>
                            </div>

                            <div className="formInput">
                                <label>Pseudo</label>
                                <input type="text" value={inputedUserSignup.pseudo || ""} placeholder='pseudo' onChange={(e) => setInputedUserSignup({ ...inputedUserSignup, pseudo:e.target.value })}/>
                            </div>
                            
                            <div className="formInput">
                                <label>Mot de passe</label>
                                <div className="showPassword">
                                    <input type={`${showPassword ? ('text') : ('password')}`} value={inputedUserSignup.password || ""} placeholder='Mot de passe' minLength={8} onChange={(e) => setInputedUserSignup({ ...inputedUserSignup, password:e.target.value })}/>
                                    <label>
                                        <div className="toggle">
                                            <input className="toggle-state" type="checkbox" name="check" value="check" onClick={() => setShowPassword(!showPassword)} />
                                            <div className="indicator"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button type='submit' className="btnPrimary">
                            <span>Créer</span>
                        </button>
                    </form>
                        <p className="alreadyAccount">Vous avez déjà un compte ? <span className="connectLink" onClick={() => setAuthMethod('signin')}>Se connecter</span></p>
                    </>
                ) : (
                    <>
                        <form method='POST' onSubmit={handleConnectUser}>
                        <div className="formContainer">
                            <div className="formInput">
                                <label>Email</label>
                                <input type="text" value={inputedUser.email || ""} placeholder='email' onChange={(e) => setInputedUser({ ...inputedUser, email:e.target.value })}/>
                            </div>
                            
                            <div className="formInput">
                                <label>Mot de passe</label>
                                <div className="showPassword">
                                    <input type={`${showPassword ? ('text') : ('password')}`} value={inputedUser.password || ""} placeholder='Mot de passe' minLength={8} onChange={(e) => setInputedUser({ ...inputedUser, password:e.target.value })}/>
                                    <label>
                                        <div className="toggle">
                                            <input className="toggle-state" type="checkbox" name="check" value="check" onClick={() => setShowPassword(!showPassword)} />
                                            <div className="indicator"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button type='submit' className="btnPrimary">
                            <span>Se connecter</span>
                        </button>
                        </form>
                        <p className="alreadyAccount">Vous n’avez pas de compte ? <span className="connectLink" onClick={() => setAuthMethod('signup')}>Rejoignez-nous !</span></p>
                        
                    </>
                )}
            </div>
        </AuthStyle>
    )
}