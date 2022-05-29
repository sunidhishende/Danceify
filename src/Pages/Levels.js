import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

//StyledComponents
const Buttonodd= styled.button`
    background-color: #d0d8fa;
    border: none;
    color: black;
    padding: 15px 100px;
    text-align: center;
    font-size: 30px;
    text-decoration: none;
    display: inline-block;
    margin: 20px ;
    transform:translate(30px, 0px);
    cursor: pointer;
    border-radius: 200px;`

const Buttoneven= styled.button`
    background-color: #d0d8fa;
    border: none;
    color: black;
    padding: 15px 100px;
    text-align: center;
    font-size: 30px;
    text-decoration: none;
    display: inline-block;
    margin: 20px ;
    transform:translate(-30px, 0px);
    cursor: pointer;
    border-radius: 200px;`

const Box= styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    `

function Levels() {
    return ( 
        <div>  
        <Box>
        <Link to = '/level/1' > 
        <Buttonodd>Level 1</Buttonodd>
        </Link >
        <Link to = '/level/2' > 
        <Buttoneven>Level 2</Buttoneven>
        </Link >
        <Link to = '/level/3' > 
        <Buttonodd>Level 3</Buttonodd>
        </Link >
        <Link to = '/level/4' > 
        <Buttoneven>Level 4</Buttoneven>
        </Link >
        </Box>
        </div>
    )


}

export default Levels