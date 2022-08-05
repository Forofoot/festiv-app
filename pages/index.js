import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { useState, useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/dist/client/router'
import styled from 'styled-components'
import { parseCookies } from "../helpers"
import Post from '../components/Post'
import { device } from '../styles/device.css'
import Modal from '../components/Modal'
import Link from 'next/link'
import Image from 'next/image'
import { set } from 'nprogress'

const PostContainer = styled.section`
  .postContainer{
    padding: 40px 20px 80px 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
    justify-content: center;
    align-items: center;
    @media ${device.laptop}{
      padding: 140px 40px 40px 40px;
    }
    .btnPrimary{
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
      z-index: 1;
      @media ${device.laptop}{
        position: absolute;
        left: 40px;
        top: 140px;
        bottom: auto;
        transform: none;
      }
    }
  }
  .btnPrimary{
      input{
          display: none;
      }
  }
  .searchBar{
    position: relative;
    top: auto;
    right: auto;
    max-width: 840px;
    width: 100%;
    @media ${device.laptop}{ 
      position: absolute;
      top: 40px;
    }
    input{
      height: 15px;
      margin-bottom: 0;
      max-width: calc(100% - 30px);
      padding-left: 30px;
      @media ${device.laptop}{
        max-width: 250px;
      }
    }
    
    .searchResults:hover{
      opacity: 1;
      visibility: visible;
    }

    .searchResults{
      position: absolute;
      top: calc(0 - 15px);
      left: 0;
      background-color: var(--white);
      width: 100%;
      border-radius: 0 0 10px 10px;
      padding: 10px;
      z-index: 10;
      opacity: 0;
      visibility: hidden;
      @media ${device.laptop}{
        max-width: 280px;
      }
      .loading{
        margin: auto;
      }
      .results{
        background-color: var(--white);
        transition: all ease-in-out 0.2s;
        padding: 10px;
        &:hover{
          background-color: var(--grey);
          color: var(--white);
        }
        a{
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .resultsImg{
          width: 45px;
          height: 45px;
          overflow: hidden;
          border-radius: 50%;
        }
        p{
          font-weight: bold;
        }
      }
    }
    input:focus + .searchResults{
      opacity: 1;
      visibility: visible;
    }
    .searchIcon{
      position: absolute;
      top:50%;
      left:0;
      transform: translateY(-50%);
    }
  }
`
export default function Home({post, currentUserLikes, festival}) {

  const [currentUser, setCurrentUser] = useState(null)
  const [cookies] = useCookies(['user'])
  const [userLikes, setUserLikes] = useState([])
  const [opened, setOpened] = useState()
  const [modalOptions, setModalOptions] = useState()
  const [posts, setPosts] = useState(post)
  const [search, setSearch] = useState({
    searchContent: '',
  })
  const [searchResults, setSearchResults] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCurrentUser(cookies.user)
  }, [cookies.user])

  const searchResult = async() => {
    setLoading(true)
    if(search.searchContent){
        const res = await fetch('/api/searchResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            search: search.searchContent
          }),
        })
        const data = await res.json()
        if(res.ok){
          setLoading(false)
          setSearchResults(data)
        }
      }else{
        setLoading(false)
        setSearchResults('')
      }
    }
  return (
    <PostContainer>
      <Head>
        <title>Festiv-App</title>
        <meta
            name="description"
            content="Festiv-App"
        />
      </Head>
      <Modal profileId={currentUser?.id} festival={festival} setOpened={setOpened} isopened={opened} setModalOptions={setModalOptions} modalOptions={modalOptions} setPosts={setPosts}/>  
      <div className='postContainer'>
        {currentUser && 
          <p className='btnPrimary' onClick={() => {setOpened(true), setModalOptions('addPost')}}><span>Ajouter un post</span></p>
        }
        <div className='searchBar'>
          <div className='searchIcon'>
            <Image src='/search/search.svg' alt='Rechercher' width={20} height={20}/>
          </div>
          <input onKeyUp={searchResult} type="text" value={search.searchContent || ""} placeholder='Tapez le pseudo' onChange={(e) => setSearch({ ...search, searchContent:e.target.value })}/>
          <div className='searchResults'>
          {loading ? (
              <span className='loader'></span>
          ) : (
            <>
              {searchResults && searchResults.length > 0 ? (
                  <>
                  {searchResults.map((elt,i) => (
                    <div key={i} className='results'>
                      <Link  href={`/profile/${elt.pseudo}`}>
                        <a>
                          <div className='resultsImg'>
                            {elt.avatar ? (
                              <Image src={elt.avatar} alt={elt.pseudo} width={45} height={45} objectFit="cover"/>
                            ) : (
                              <Image src='/profile/avatar.webp' alt={elt.pseudo} width={45} height={45} objectFit="cover"/>
                            )}
                          </div>
                          <p>{elt.pseudo}</p>
                        </a>
                      </Link>
                    </div>
                  ))}
                  </>
              ) : (
                <p>Aucun résultat</p>
              )}
            </>
          )}
          </div>
        </div>
        {posts.map((elt, i) =>(
            <Post key={i} data={elt} currentUserId={currentUser?.id} currentUserLikes={currentUserLikes}/>
        ))}
      </div>
    </PostContainer>
  )
}

export async function getServerSideProps({req, res}){
  const cookie = parseCookies(req)
  const prisma = new PrismaClient()
  const data = await prisma.post.findMany({
    orderBy:{
      updatedAt:'desc'
    },
    select:{
      id:true,
      content:true,
      image:true,
      user:{
        select:{
          pseudo:true,
          avatar:true
        }
      },
      festival:{
        select:{
          title:true
        }
      },
      comments:{
        select:{
          content: true,
          updatedAt:true,
          user:{
            select:{
              pseudo:true,
              avatar:true
            }
          }
        },
        take:2,
        orderBy:{
          updatedAt:'desc'
        }
      },
      likes:{
        select:{
          user:{
            select:{
              pseudo:true
            }
          }
        }
      }
    }
  })

  const festival = await prisma.festival.findMany()
  
  if(res){
    if(cookie.user){
      const parsedUser = JSON.parse(cookie.user)
      const user = await prisma.user.findUnique({
        where: {
          pseudo: parsedUser.pseudo,

        },
        select:{
          likes:{
            select:{
              post_id:true
            }
          }
        }
      })
      return{
        props:{
          post: data,
          currentUserLikes: user.likes,
          festival
        }
      }
    }
  }
  return{
    props:{
      post: data,
      festival
    }
  }
}
