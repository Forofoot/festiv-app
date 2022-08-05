import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { device } from '../styles/device.css'
import toast from 'react-hot-toast'
import { useRouter } from 'next/dist/client/router'
import { useCookies } from 'react-cookie'

const ModalStyle = styled.div`
    .overlay{
        color: #fff;
        height: 100vh;
        position: absolute;
        visibility: hidden;
        width: 100%;
        opacity: 0;
        transition: opacity .5s ease-out;
        z-index: 50;
        top: 0;
        left: 0;
        cursor: pointer;
        &.active{
            opacity: 1;
            visibility: visible;
            background-color: rgba(0,0,0, 0.3);
        }
    }
    .modal{
        width: 320px;
        min-height: 250px;
        background:#fff;
        border-radius: 20px;
        position: absolute;
        visibility: hidden;
        opacity: 0;
        top: 50%;
        left: 50%;
        transform: scale(0) translate(-50%, -50%);
        transition: all .2s ease-out;
        padding: 40px;
        color: #000;
        z-index: 100;
        display: flex;
        align-items: center;
        @media ${device.mobile}{
            width: 390px;
            min-height: 250px;
        }
        &.active{
            opacity: 1;
            visibility: visible;
            transform: scaleX(1) translate(-50%, -50%);
        }
        .cross{
            position: absolute;
            right: 25px;
            top: 10px;
            font-size: 2em;
            cursor: pointer;
        }
        form{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            textarea{
                max-width: 100%;
                max-height: 100%;
                min-width: 220px;
                min-height: 110px;
                padding: 10px 20px;
                color: var(--primary);
                font-size: 0.875rem;
                @media ${device.mobile}{
                    min-width: 270px;
                    min-height: 110px;
                }
            }
            label{
                font-size: 1rem;
                font-weight: bold;
                color: var(--secondary);
            }
            .limitedTo{
                width: 100%;
                font-size: 0.875rem;
                color: var(--greyDark);
                text-align: right;
            }
        }
        .preview{
            max-width:125px;
            max-height: 125px;
            height: 100%;
            width: 100%;
            object-fit: cover;
            @media ${device.mobile}{
                max-height: 250px;
                max-width: 100%;
            }
        }
        .festivalsContainer{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
            gap: 15px;
            margin-bottom: 20px;
            .festival{
                text-align: center;
                padding: 10px;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); 
                border-radius: 10px;
                cursor: pointer;
                background-color: var(--white);
                color: var(--primary);
                transition: all .3s ease;
                &.active{
                    background-color: var(--secondary);
                    color: var(--white);
                }
            }
        }
    }
`

function Modal({setOpened, isopened, profileDescription,  profileId, modalOptions, festival, setPosts}) {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const [inputedUser, setInputedUser] = useState({
        description: profileDescription,
        newPassword: '',
        confirmPassword: '',
        content:'',
        festival:''
    }) 
    const [imageUploaded, setImageUploaded] = useState();
    const [previewImage, setpreviewImage] = useState();
    const [cookie] = useCookies(['user'])

    const handleChange = (event) => {
        setImageUploaded(event.target.files[0]);
        setpreviewImage(URL.createObjectURL(event.target.files[0]))
    };

    const handleAddPost = async(e) =>{
        e.preventDefault()
        const formData = new FormData()
        formData.append("image", imageUploaded)
        formData.append("content", inputedUser.content)
        formData.append("user", profileId)
        formData.append("festival", inputedUser.festival)
        const res = await fetch(`/api/post/createPost`, {
            method: 'POST',
            body: formData,
        })
        const data = await res.json()

        if(res.ok){
            setPosts(prevState => [{id:data.id, content:data.content, image:data.image, user:{
                avatar: cookie.user?.avatar, pseudo: cookie.user?.pseudo
            }, festival:{
                title: inputedUser.festival
            },
            comments:[],
            likes:[]}, ...prevState])
            setOpened(null)
        }
      }

    const handleChangePassword = async(e) =>{
        e.preventDefault()
        try{
            toast.loading('Chargement en cours')
            console.log(inputedUser.newPassword)
            console.log(inputedUser.confirmPassword)
            if(inputedUser.newPassword !== inputedUser.confirmPassword){
                toast.remove()
                toast.error('Mots de passes non identiques')
            }else{
                if(!inputedUser.newPassword || !inputedUser.confirmPassword){
                    toast.remove()
                    toast.error('Les champs ne peuvent être vide')
                }else{
                    const res = await fetch('/api/profile/changePassword', {
                        method:'POST',
                        headers:{
                            'Content-Type':  'application/json'
                        },
                        body:JSON.stringify({
                            confirmPassword: inputedUser.confirmPassword,
                            newPassword: inputedUser.newPassword,
                            profile_id: profileId
                        })
                    })
        
                    if(res.ok){
                        toast.remove()
                        toast.success('Mot de passe changé')
                        router.replace(router.asPath)
                        setOpened(null)
                    }else{
                        toast.error('Erreur')
                    }
                }
            }
        }catch(e){
            console.log(e)
        }
    }

    const handleChangeDescription = async(e) =>{
        e.preventDefault()
        try{
            toast.loading('Chargement en cours ...')
            const res = await fetch('/api/profile/changeDescription', {
                method:'POST',
                headers:{
                    'Content-Type':  'application/json'
                },
                body:JSON.stringify({
                    description: inputedUser.description,
                    profile_id: profileId
                })
            })

            if(res.ok){
                toast.remove()
                toast.success('Description changée')
                router.replace(router.asPath)
                setOpened(null)
            }else{
                toast.error('Erreur')
            }
        }catch(e){
            console.log(e)
        }
    }
  return (
    <ModalStyle>
        <div className={`overlay ${isopened ? ('active') : ('')}`} onClick={() => setOpened(false)}></div>
        <div className={`modal ${isopened ? ('active') : ('')}`}>
            <div className='cross' onClick={() => setOpened(false)}>
                x
            </div>
            {modalOptions === 'description' && 
                <form onSubmit={handleChangeDescription}>
                    <label>Description</label>   
                    <textarea value={inputedUser.description || ''} onChange={(e) => setInputedUser({ ...inputedUser, description:e.target.value })}></textarea> 
                    <p className='limitedTo'>Limité à 100 caractères</p>
                    <button className="btnPrimary">
                        <span>Modifier</span>
                    </button>
                </form>
            }

            {modalOptions === 'password' && 
                <form onSubmit={handleChangePassword}>
                    <label>Nouveau mot de passe</label>
                    <input type={`${showPassword ? ('text') : ('password')}`} placeholder='Mot de passe' value={inputedUser.newPassword || ''} minLength={8} onChange={(e) => setInputedUser({ ...inputedUser, newPassword:e.target.value })}/>
                    <label>Confirmation de mot de passe</label>
                    <div className="showPassword">
                        <input type={`${showPassword ? ('text') : ('password')}`} placeholder='Mot de passe' value={inputedUser.confirmPassword || ''} minLength={8} onChange={(e) => setInputedUser({ ...inputedUser, confirmPassword:e.target.value })}/>
                        <label>
                            <div className="toggle">
                                <input className="toggle-state" type="checkbox" name="check" value="check" onClick={() => setShowPassword(!showPassword)} />
                                <div className="indicator"></div>
                            </div>
                        </label>
                    </div>
                    <button className="btnPrimary">
                        <span>Modifier</span>
                    </button>
                </form>
            }

            {modalOptions === 'addPost' && 
                <form onSubmit={handleAddPost}>
                    <label>Description</label>
                    <textarea value={inputedUser.content || ''} onChange={(e) => setInputedUser({ ...inputedUser, content:e.target.value })}></textarea> 
                    <label>Image</label>
                    {previewImage &&
                        <img className="preview" src={previewImage} alt="Prévisualitation de l'image"/>
                    }
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
                    <label>Sélectionner un festival</label>
                    <div className='festivalsContainer'>
                        {festival?.map((elt, i) => (
                            <div onClick={() => setInputedUser({ ...inputedUser, festival:elt.id })} key={i} className={`festival ${inputedUser.festival === elt.id ? ('active') : ('')}`}>
                                {elt.title}
                            </div>
                        ))}
                    </div>
                    <button className="btnPrimary">
                        <span>Modifier</span>
                    </button>
                </form>
            }
            
        </div>
    </ModalStyle>
  )
}

export default Modal