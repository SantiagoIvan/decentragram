import styled from 'styled-components'

export const PostContainer = styled.div`
    border: 2px solid red;
    margin: 2rem 0rem;
`

export const AvatarContainer = styled.div`
    border: 2px solid green;
    display: flex;
    justify-content: space-around;
    margin-bottom: 0.5rem;
    align-items: center;
`

export const Avatar = styled.img`
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
    border: 2px solid violet;
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
    border: 2px solid black;
    margin: 1rem;
`

export const TipButtonContainer = styled.div`
    display: flex;
    justify-content: center;
`