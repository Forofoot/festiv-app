import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const FooterStyle = styled.footer`
    width: 100%;
    padding: 40px 20px;
    text-align: center;
    color: var(--secondary);
`

function Footer() {
  return (
    <FooterStyle>
        <Link href="/politic">
            <a>
                Politique de confidentialité
            </a>
        </Link>
    </FooterStyle>
  )
}

export default Footer