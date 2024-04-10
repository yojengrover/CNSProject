import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './Login.css';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                <form className="loginForm">
                    <div className="loginFormField">
                        <label htmlFor="email" className="loginLabel">
                            Email
                        </label>
                        <input
                            id="email"
                            className="loginInput"
                            placeholder="m@example.com"
                            type="email"
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
                    <button className="loginButton" type="submit">
                        Sign In
                    </button>
                </form>
                <div className="loginLinks">
                    <a href="#" className="loginLink">Forgot password?</a>
                    <a href="#" className="loginLink">Create account</a>
                </div>
            </div>
        </div>
    );
};

export default Login;