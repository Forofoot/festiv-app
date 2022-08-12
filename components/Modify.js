import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import Image from 'next/image';

export default function Modify({profileAvatar, previewImage, profilePseudo, profileId, profileFirstName, profileLastName, profileEmail, profileDescription, setCurrentUser, setpreviewImage, setOpened, setModalOptions, modalOptions}) {
    const router = useRouter()
    
    const [imageUploaded, setImageUploaded] = useState();
    const [cookie, setCookie, removeCookie] = useCookies(['user'])
    const handleChange = (event) => {
        setImageUploaded(event.target.files[0]);
        setpreviewImage(URL.createObjectURL(event.target.files[0]))
    };
    const [loading, setLoading] = useState(false);
    const handleModifyInfos = async(e) =>{
        e.preventDefault()
        setLoading(true)
        toast.loading('Chargement en cours...')
        const formData = new FormData()
        formData.append("image", imageUploaded)
        const res = await fetch(`/api/profile/${profilePseudo}`, {
            method: 'POST',
            body: formData,
        })
        
        if(res.ok){
            const data = await res.json()
            setLoading(false)
            toast.remove()
            setCookie("user", JSON.stringify(data), {
                path: '/',
                maxAge: 2592000,
                sameSite: true,
            })
            toast.success('Profil modifié')
            router.push(`/profile/${data.pseudo}`)
        }else{
            setLoading(false)
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
                    currentUser: profileId
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

    return (
        <div className="infoBlock">
            <h1>Modifier le profil</h1>

            <div className="profilePicture">
                {previewImage ? (
                    <img className="preview" src={previewImage} alt="Prévisualitation de l'image" width={217} height={217}/>
                ) : (
                    <>
                    {profileAvatar ? (
                        <Image
                            src={`${profileAvatar}`}
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

            <form className='formImage' onSubmit={handleModifyInfos}>

                <label className="btnPrimary">
                    <span>Changer de photo</span>
                    <input
                        onChange={handleChange}
                        accept="images/*"
                        type="file"
                        id='file-input'
                        name="avatar"
                    ></input>
                </label>
                {previewImage && (
                    <button className="btnPrimary" disabled={loading ? true : false}>
                        {loading ? (
                            <span className='loader'></span>
                        ) : (
                            <span>Modifier</span>
                        )}
                    </button>
                )}
            </form>

            <div className='grid'>
                <div className='informationsBlock modifyBlock'>
                    <h2>Infomations personnelles</h2>

                    <div className='label'>
                        <p>Pseudo</p>
                        <span>{profilePseudo}</span>
                    </div>
                    <div className='label'>
                        <p>Nom</p>
                        <span>{profileLastName}</span>
                    </div>
                    <div className='label'>
                        <p>Prénom</p>
                        <span>{profileFirstName}</span>
                    </div>
                    <div className='label'>
                        <p>Adresse email</p>
                        <span>{profileEmail}</span>
                    </div>
                </div>
                <div className='descriptionBlock modifyBlock'>
                    <p className='modifyLabel' onClick={() => {setOpened(true), setModalOptions('description')}}>Modifier</p>
                    <h2>Changer description</h2>
                    <div className='label'>
                        <p>Description</p>
                        <p className='descriptionText'>{profileDescription}</p>
                    </div>

                </div>
                <div className='passwordBlock modifyBlock'>
                    <p className='modifyLabel' onClick={() => {setOpened(true), setModalOptions('password')}}>Modifier</p>
                    <h2>Changer mot de passe</h2>
                    <div className='label'>
                        <p>Mot de passe</p>
                        <span>****************************</span>
                    </div>
                </div>
            </div>
            <p className='btnSecondary' onClick={(e) => handleDeleteUser(e)}>Supprimer le compte</p>
        </div>
  )
}
