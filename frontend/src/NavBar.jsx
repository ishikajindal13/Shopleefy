import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            axios.post('http://localhost:8000/api/v1/users/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });

            navigate('/signin');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    return (
        <nav className="navbar">
            <Link to="/mainpage" className="navbar-logo"><h1>Pet Adoption And Management</h1></Link>
            <ul className="navbar-links">
                <li><Link to="/items">Items</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><button onClick={handleSignOut} className='sign-out-btn'>Sign Out</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
