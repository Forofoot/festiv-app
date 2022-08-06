import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import styled from 'styled-components'
import Post from '../components/Post'
import { device } from '../styles/device.css'
import Modal from '../components/Modal'
import Link from 'next/link'
import Image from 'next/image'

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
    .notLogged{
      a{
        color: var(--secondary);
        text-decoration: underline;
      }
    }
    .loadPost{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .loader{
        @media ${device.laptop}{
          width: 30%;
        }
        &::before{
          @media ${device.laptop}{
            left: -150px;
          }
        }
      }
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
export default function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [cookies] = useCookies(['user'])
  const [opened, setOpened] = useState()
  const [modalOptions, setModalOptions] = useState()
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState({
    searchContent: '',
  })
  const [searchResults, setSearchResults] = useState()
  const [loading, setLoading] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [userLikes, setUserLikes] = useState([])
  const [ifNavigator, setIfNavigator] = useState()

  
  useEffect(() => {
    navigator.share ? setIfNavigator(true) : setIfNavigator(false)
    {cookies.user &&
      fetch(`api/post/userLikes`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: cookies.user?.id
        })
      }).then(res => res.json()).then(res => {
        setUserLikes(res.likes)
      })
    }
  }, [setUserLikes, cookies.user, setPosts])


  useEffect(() => {
    if(cookies.user){
      setCurrentUser(cookies.user)
      fetch(`api/post/fetchPosts`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: cookies.user?.id
        })
      }).then(res => res.json()).then(res => {
        setPosts(res)
        setLoadingPosts(false)
      })
    }else{
      setPosts([])
      setCurrentUser(null)
      setLoadingPosts(false)
    }
  }, [cookies.user, setPosts])

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
        <meta name="description" content="" />
      </Head>
      <div className='postContainer'>
        {currentUser && (
          <Link href={'/post/addPost'}>
            <a>
              <p className='btnPrimary'><span>Ajouter un post</span></p>
            </a>
          </Link>
        )}
        
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
        {posts.length > 0 ? (
            <>
            {posts.map((elt, i) =>(
              <Post setUserLikes={setUserLikes} setPosts={setPosts} ifNavigator={ifNavigator} userLikes={userLikes} key={i} data={elt} currentUserId={currentUser?.id}/>
            ))}
            </>
        ) : (
          <>
          {loadingPosts ? (
            <div className='loadPost'>
              <span className="loader"></span>
            </div>
          ) : (
            <>
            <h1>Aucune publication</h1>
            
            {!currentUser && (
              <h2 className='notLogged'>Veuillez vous connecter <Link href={'/auth/'}><a>ici</a></Link></h2>
            )}
            </>
          )}
          </>
        )}
        
      </div>
    </PostContainer>
  )
}
