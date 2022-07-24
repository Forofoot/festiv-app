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
    font-size: 16px;
    background-color: #EFEFEF;
    @media (min-width: 768px) {
      font-size: 20px;
    }
  }

  ul{
    list-style: none;
    li{
      display: inline-block;
    }
  }
  button,
  a{
    cursor: pointer;
    text-decoration: none;
  }

  form{
    display: flex;
    align-items:center;
    flex-direction: column;
    gap: 15px;
  }

  :root{
    --primary: #000000;
    --secondary: #7620BB;
  }
`