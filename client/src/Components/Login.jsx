import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SignUpModal from './SignUpModal';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const openSignUpModal = () => {
        setIsSignUpModalOpen(true);
    };

    const closeSignUpModal = () => {
        setIsSignUpModalOpen(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send email and password to your server
            const response = await axios.post('http://localhost:8000/login', {
                email: email,
                password: password
            });

            // Assuming your server responds with a JSON object containing a 'userExists' property
            const { msg, name } = response.data;

            if (msg) {
                console.log(response);
                return navigate("/verify", { state: { name: name } });
            } else {
                // User doesn't exist or password is wrong, display error message
                setError('User does not exist or password is wrong');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="loginContainer">
            <div className="loginContent">
                <div className="loginHeader">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="loginIcon"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="21.17" y1="8" x2="12" y2="8"></line>
                        <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                        <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                    </svg>
                    <h1 className="loginTitle">Sign in to continue</h1>
                </div>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <div className="loginFormField">
                        <label htmlFor="email" className="loginLabel">
                            Email
                        </label>
                        <input
                            id="email"
                            className="loginInput"
                            placeholder="m@example.com"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="loginFormField">
                        <label htmlFor="password" className="loginLabel">
                            Password
                        </label>
                        <div className="passwordInput">
                            <input
                                id="password"
                                className="loginInputP"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button
                                className="passwordToggle"
                                type="button"
                                onClick={togglePasswordVisibility}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="passwordToggleIcon"
                                >
                                    {showPassword ? (
                                        <>
                                            <VisibilityOffIcon />
                                        </>
                                    ) : (
                                        <VisibilityIcon />
                                    )}
                                </svg>
                                <span className="passwordToggleText">Toggle password visibility</span>
                            </button>
                        </div>
                    </div>
                    {error && <p className="errorMessage">{error}</p>}
                    <button className="loginButton" type="submit">
                        Sign In
                    </button>
                </form>
                <div className="loginLinks">
                    <a href="#" className="loginLink">Forgot password?</a>
                    <a href="#" className="loginLink" onClick={openSignUpModal}>Create account</a>
                </div>
            </div>
            {isSignUpModalOpen && <SignUpModal closeModal={closeSignUpModal} />}
        </div>
    );
};

export default Login;
