import React, {useState} from 'react'
import styled from 'styled-components'

const ModalStyle = styled.div`
    .overlay{
        color: #fff;
        height: 100%;
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
        width: 500px;
        height: 500px;
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
        &.active{
            opacity: 1;
            visibility: visible;
            transform: scaleX(1) translate(-50%, -50%);
        }
        .cross{
            position: absolute;
            right: 25px;
            top: 15px;
            font-size: 2em;
            cursor: pointer;
        }
    }
`

function Modal({setOpened, isopened}) {
  return (
    <ModalStyle>
        <div className={`overlay ${isopened ? ('active') : ('')}`} onClick={() => setOpened(false)}></div>
        <div className={`modal ${isopened ? ('active') : ('')}`}>
            <div className='cross' onClick={() => setOpened(false)}>
                x
            </div>
            I am a Modal
        </div>
    </ModalStyle>
  )
}

export default Modal