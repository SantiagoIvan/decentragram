import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Blockies from 'react-blockies'

export const PostContainer = styled.div`
    margin: 2rem 0rem;
    min-height: 200px;
    border-bottom: 2px solid black;
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
    transition: box-shadow linear 0.5s;
    border: none;
    &:hover{
        box-shadow: 0 0 50px #e1306c;
    }
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
    cursor: pointer;
    transition: box-shadow linear 0.5s;
    border: none;
    &:hover{
        box-shadow: 0 0 50px #e1306c;
    }
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