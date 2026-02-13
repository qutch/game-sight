import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './Login.jsx';
import ProfileComponent from './Profile';
import LandingPageComponent from './LandingPage.jsx';
import "./index.css";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPageComponent/>} />
                <Route path="/login" element={<LoginComponent/>} />
                <Route path="/profile" element={<ProfileComponent/>} />
            </Routes>
        </Router>
    )
}

export default App;