import React from 'react';
import { Link } from 'react-router-dom';
import "./index.css";

function LandingPageComponent() {
    return (
        <div>
            <h1 className="text-xl text-white">Welcome</h1>
            <nav>
                <Link to="/login" className="text-lg text-white p-5">Login Page</Link>
                <Link to="/profile" className="text-lg text-white p-5">Profile Page</Link>
            </nav>
        </div>
    )
}

export default LandingPageComponent;