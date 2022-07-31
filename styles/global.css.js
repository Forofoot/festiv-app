import { createGlobalStyle } from 'styled-components'
import { device } from './device.css'

export default createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  * {
    margin: 0;
  }

  html, body {
    height: 100%;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  body {
    margin: 0; 
    padding: 0;
    min-height:100vh;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    background-color: #EFEFEF;
    &::-webkit-scrollbar{
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    @media (min-width: 768px) {
      font-size: 16px;
    }
  }

  ul{
    list-style: none;
    li{
      display: inline-block;
    }
  }

  label{
    width: 100%;
  }

  input{
    all: unset;
    padding: 5px 0;
    border-bottom: 2px solid var(--primary);
    width: 100%;
    margin-bottom: 10px;
    transition: border .2s linear;
    &::placeholder{
      color: var(--grey);
    }
    &:focus{
      border-color: var(--secondary);
    }
  }

  button,
  a{
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  form{
    display: flex;
    align-items:center;
    flex-direction: column;
    gap: 15px;
  }

  .btnPrimary{
    all: unset;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0px;
    width: 210px;
    color: var(--white);
    background: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    transition: all .3s ease;
    font-weight: bold;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(90.32deg, #6300B1 8.05%, #002762 82.81%);
      transition: transform 0.3s cubic-bezier(0.7, 0, 0.2, 1);
      height: 100%;
    }
    span{
      position: relative;
      color: var(--white);
      font-weight: 400;
    }
    &:hover{
      &::before {
        transform: translate3d(0,-100%,0);
      }
      span{
        color: var(--secondary);
      }
    }
    @media ${device.mobile}{
      width: 175px;
    }
  }

  :root{
    --primary: #000000;
    --secondary: #7620BB;
    --grey: #c2c2c2;
    --white: #ffffff;
  }
`