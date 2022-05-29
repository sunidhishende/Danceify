import React from 'react'
import { Link } from 'react-router-dom'
import styled from "styled-components"

//StyledComponents
const Button= styled.button`
background-color: #d0d8fa;
border: none;
color: black;
padding: 15px 100px;
text-align: center;
font-size: 25px;
text-decoration: none;
display: inline-block;
margin: 40px ;
cursor: pointer;
border-radius: 200px;`

const H1= styled.h1`
background: #FFFFFF;
background: linear-gradient(to right, #FFFFFF 0%, #838FFF 90%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;   
font-weight: 400;
font-size: 150px;
font-family: Iceland;
margin: 0px 0px 0px 0px;
`
const H3= styled.h3`
color: #d0d8fa;
font-weight:400;
font-size:30px;
margin: 0px 0px 0px 0px;
`
const Box= styled.div`
height: 100vh;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
`

function Home() {
    return ( 
        <div>
            <Box>
            <H1>DANCEIFY</H1>
            <H3>Learn how to dance with Machine Learning</H3>
            <Link to='/levels'>
                <Button>Let's Dance!</Button>
            </Link>
            </Box>
        </div>
    )


}

export default Home