import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Blockies from 'react-blockies'

export const PostContainer = styled.div`
    border: 2px solid black;
    margin: 2rem 0rem;
`

export const AvatarContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 0.5rem;
    align-items: center;
`

export const Avatar = styled(Blockies)`
    width: 40px;
    heigth: 40px;
    border-radius: 50%;
    margin-left: 0.5rem;
`

export const PostTitle = styled.h3`
    font-family: 'Redressed', cursive;
    color: brown;
    margin-right: 0.5rem;
`

export const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-wrap: break-word;
}

`

export const PostImage = styled.img`
    width: 100%;
    max-width: 400px;
    heigth: 100%;
`

export const PostDescription = styled.p`
    font-family: 'Lobster', cursive;
    width: 100%;
    margin: 1rem;
    font-size: 1rem
`

export const TipButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items:center;
`

export const CustomLink = styled(Link)`
    margin: 0;
    padding: 0;
`