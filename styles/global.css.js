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
    border-bottom: 1px solid var(--primary);
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

  section{
    min-height: calc(100vh - 90px);
  }

  form{
    display: flex;
    align-items:center;
    flex-direction: column;
    gap: 15px;
  }

  textarea{
    all: unset;
    border: 1px solid var(--secondary);
    border-radius: 10px;
  }

  .showPassword{
      position: relative;
      width: 100%;
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

  .btnSecondary{
    all: unset;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0px;
    width: 210px;
    color: var(--red);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    transition: all .3s ease;
    border: 1px solid var(--red);
    margin: auto;
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
      font-weight: bold;
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

  .heart-svg{
    cursor:pointer; overflow:visible; width:60px;
    .heart{transform-origin:center; animation:animateHeartOut .3s linear forwards;}
    .main-circ{transform-origin:29.5px 29.5px;}
  }
  .heart-svg.liked{
    .heart{transform:scale(.2); fill:#E2264D; animation:animateHeart .3s linear forwards .25s;}
    .main-circ{transition:all 2s; animation:animateCircle .3s linear forwards; opacity:1;}
    .grp1{
      opacity:1; transition:.1s all .3s;
      .oval1{
        transform:scale(0) translate(0, -30px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      .oval2{
        transform:scale(0) translate(10px, -50px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    .grp2{
      opacity:1; transition:.1s all .3s;
      .oval1{
        transform:scale(0) translate(30px, -15px); 
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      .oval2{
        transform:scale(0) translate(60px, -15px); 
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    .grp3{
      opacity:1; transition:.1s all .3s;
      .oval1{
        transform:scale(0) translate(30px, 0px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      .oval2{
        transform:scale(0) translate(60px, 10px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    .grp4{
      opacity:1; transition:.1s all .3s;
      .oval1{
        transform:scale(0) translate(30px, 15px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      .oval2{
        transform:scale(0) translate(40px, 50px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    .grp5{
      opacity:1; transition:.1s all .3s;
      .oval1{
        transform:scale(0) translate(-10px, 20px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      .oval2{
        transform:scale(0) translate(-60px, 30px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    .grp6{
      opacity:1; transition:.1s all .3s;
      .oval1{
        transform:scale(0) translate(-30px, 0px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      .oval2{
        transform:scale(0) translate(-60px, -5px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    .grp7{
      opacity:1; transition:.1s all .3s;
      .oval1{
        transform:scale(0) translate(-30px, -15px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      .oval2{
        transform:scale(0) translate(-55px, -30px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    .grp2{opacity:1; transition:.1s opacity .3s;}
    .grp3{opacity:1; transition:.1s opacity .3s;}
    .grp4{opacity:1; transition:.1s opacity .3s;}
    .grp5{opacity:1; transition:.1s opacity .3s;}
    .grp6{opacity:1; transition:.1s opacity .3s;}
    .grp7{opacity:1; transition:.1s opacity .3s;}

  }

    @keyframes animateCircle{
  40%{transform:scale(10); opacity:1; fill:#DD4688;}
  55%{transform:scale(11); opacity:1; fill:#D46ABF;}
  65%{transform:scale(12); opacity:1; fill:#CC8EF5;}
  75%{transform:scale(13); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:.5;}
  85%{transform:scale(17); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:.2;}
  95%{transform:scale(18); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:.1;}
  100%{transform:scale(19); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:0;}
}

@keyframes animateHeart{
  0%{transform:scale(.2);}
  40%{transform:scale(1.2);}
  100%{transform:scale(1);}
}

@keyframes animateHeartOut{
  0%{transform:scale(1.4);}
  100%{transform:scale(1);}
}

.loader{
  display: inline-block;
  width: 40%;
  height: 3px;
  border-radius: 40px;
  background-color: var(--white);
  position: relative;
  overflow: hidden;
}
.loader::before{
  content:'';
  position: absolute;
  top: 0;
  left: -50px;
  width: 200%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90.32deg, #6300B1 8.05%, #002762 82.81%);
  transform: scaleX(0);
  transform-origin: left;
  animation: scale 1s infinite;
  border-radius: 40px;
}
@keyframes scale{
  50%{
    transform: scaleX(1);
  }
  100%{
    transform: scaleX(0);
    transform-origin: right;
  }
}
  :root{
    --primary: #000000;
    --secondary: #7620BB;
    --grey: #c2c2c2;
    --greyDark: #848484;
    --white: #ffffff;
    --green: #29a544;
    --red:#FF0000; 
  }
`