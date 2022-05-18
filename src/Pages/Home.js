import React from 'react'
import { Link } from 'react-router-dom'

function Home(){
    return(
        <div>
            <Link to='/start'><button>Start</button></Link>
        </div>
    )


}

export default Home