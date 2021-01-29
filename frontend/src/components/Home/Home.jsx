import React from "react";
import { Link } from 'react-router-dom'

const Home = (props) => {
    
    return (
        <div className="Home">
            <Link to="/overview">Tab overview</Link>
        </div>
    )
}

export default Home