    import React from 'react'
    import { Link } from 'react-router-dom'
    



    function Home() {
        return ( 
            <div>  
            <Link to = '/levels' > 
            <button>Let's Dance!</button>
            </Link >
            </div>
        )


    }

    export default Home