import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {PrismaClient} from '@prisma/client'
import { device } from '../../styles/device.css'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import { toast } from 'react-hot-toast'
import Head from 'next/head'

const AddPostStyle = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 40px 20px;
    h1{
        text-align: center;
        text-transform: uppercase;
        color: var(--primary);
        margin-bottom: 40px;
    }
    .addPostContainer{
        background-color: var(--white);
        max-width: 550px;
        padding: 10px;
        width: 100%;
        border-radius: 20px;
        padding: 40px;
        color: #000;
        form{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            input{
                display: none;
            }
            textarea{
                max-width: 100%;
                max-height: 100%;
                width: calc(100% - 40px);
                min-height: 110px;
                padding: 10px 20px;
                color: var(--primary);
                font-size: 0.875rem;
            }
            label{
                font-size: 1rem;
                font-weight: bold;
                color: var(--secondary);
            }
        }
        .preview{
            max-height: 125px;
            height: 100%;
            width: 100%;
            object-fit: contain;
            @media ${device.mobile}{
                max-height: 250px;
                max-width: 100%;
            }
        }
        .placeholderImg{
           height: 125px;
           width: 100%;
           background-color: var(--white);
           @media ${device.mobile}{
                height: 250px;
            }
        }
        .festivalsContainer{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
            gap: 15px;
            margin-bottom: 40px;
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

function AddPost({festival}) {

    const [cookies] = useCookies(['user'])
    const [inputedUser, setInputedUser] = useState({
        festival: '',
        content: '',
    })

    const [currentUser, setCurrentUser] = useState()
    const [imageUploaded, setImageUploaded] = useState();
    const [previewImage, setpreviewImage] = useState();
    const [loading, setLoading] = useState(false);

    const router = useRouter()
    
    const handleChange = (event) => {
        setImageUploaded(event.target.files[0]);
        setpreviewImage(URL.createObjectURL(event.target.files[0]))
    };

    const handleAddPost = async(e) =>{
    e.preventDefault()
    setLoading(true)
    if(!currentUser){
        toast.error('Vous devez être connecté pour poster un message')
        router.push('/auth/')
    }else{
        const formData = new FormData()
        formData.append("image", imageUploaded)
        formData.append("content", inputedUser.content)
        formData.append("user", currentUser?.id)
        formData.append("festival", inputedUser.festival)
        const res = await fetch(`/api/post/createPost`, {
            method: 'POST',
            body: formData,
        })
    
        if(res.ok){
            setLoading(false)
            router.push('/home')
            toast.success('Post créé avec succès')
            }else{
                setLoading(false)
                toast.error('Veuillez remplir tous les champs')
            }
        }
    }
    
    useEffect(() => {
        if(cookies.user){
            setCurrentUser(cookies.user)
        }else{
            router.push('/auth/')
            toast.error('Vous devez être connecté pour accéder à cette page')
        }
    }, [cookies.user, router])
  return (
    <AddPostStyle>
         <Head>
            <title>Festiv-App | Ajouter une publication</title>
            <meta
                name="description"
                content="Partager vos meilleurs moments depuis la page 'ajouter une publication'"
            />
        </Head>
        <h1>Ajouter une publication</h1>
        <div className='addPostContainer'>
        <form onSubmit={handleAddPost}>
            <label>Description</label>
            <textarea value={inputedUser.content || ''} onChange={(e) => setInputedUser({ ...inputedUser, content:e.target.value })}></textarea> 
            <label>Image</label>
            <div className='placeholderImg'>
                {previewImage &&
                    <img className="preview" src={previewImage} alt="Prévisualitation de l'image"/>
                }
            </div>
            <label className="btnPrimary">
                <span>Changer de photo</span>
                <input
                    onChange={handleChange}
                    accept="image/*"
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
            <button className="btnPrimary" disabled={loading ? true : false}>
                {loading ? (
                    <span className='loader'></span>
                ) : (
                    <span>Ajouter</span>
                )}
            </button>
        </form>
        </div>
    </AddPostStyle>
  )
}

export default AddPost



export async function getServerSideProps({req, res}){
    const prisma = new PrismaClient()
  
    const festival = await prisma.festival.findMany()
    
    return{
      props:{
        festival
      }
    }
  }