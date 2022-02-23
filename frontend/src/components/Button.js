import styled from "styled-components";

export const ConnectButton = styled.button`
    margin: 1rem;
    margin-right: 2rem;
    border-radius: 12px;
    padding: 10px 24px;
    border: 1px solid #e1306c;
    color: #e1306c;
    font-weight: bold;
    cursor: pointer;
    transition: 0.5s all ease;

    &:hover{
        transition: 0.5s all ease;
        color: whitesmoke;
        background-color: #e1306c;
    }
`

export const TipButton = styled.button`
    background: #e1306c;
    font-size: 2rem;
    border-radius: 30%;
    border: none;
    color: black;
    transition: 0.5s all ease;
    font-family: 'Redressed', cursive;

    &:hover {
        transition: 0.5s all ease;
        color: white;
        cursor: pointer;
    }
`