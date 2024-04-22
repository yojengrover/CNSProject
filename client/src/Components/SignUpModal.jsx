import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUpModal.css";

const SignUpModal = ({ closeModal }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const navigate = useNavigate();

    const SuccessModal = ({ message }) => {
        return (
          <div className="modal-overlay">
            <div className="modal">
              <p>Sign up successful! Redirecting...</p>
            </div>
          </div>
        );
      };

    const validateEmail = (email) => {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // Password validation regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset error messages
        setEmailError('');
        setPasswordError('');
        // Check if passwords match and are valid
        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }
        if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            return;
        }
        if (!validatePassword(password)) {
            setPasswordError('Password should be at least 8 characters long, contain one uppercase letter, one special character, and one digit');
            return;
        }

        try {
            // Send name, email, and password to your server for authentication
            const response = await axios.post('http://localhost:8000/signup', {
                name: name,
                email: email,
                password: password
            });
            // Assuming your server responds with a JSON object containing a 'success' property
            const { msg } = response.data;
            console.log(response.data);
            if (msg) {
                console.log('Authentication successful, navigating to FileUpload.jsx');
                setSuccessMessage(true);
                setTimeout(() => {
                    closeModal(); // Close modal after redirecting
                }, 3000); // Redirect after 3 seconds
            } else {
                // Authentication failed, display error message
                console.log('Authentication failed: email does not exist or password is wrong');
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const handleClose = () => {
        closeModal();
    };

    return (
        <div className={`modal-1-overlay open`}>
            {successMessage ? <SuccessModal/>:(
            <div className="modal-1-modal">
                <header>
                    <h2>Sign Up</h2>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="textbox">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="textbox">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div className="textbox">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                    <div className="textbox">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {!passwordsMatch && <p className="error-message">Passwords do not match</p>}
                    </div>
                    <button className="signup-button" type="submit">
                        Sign up
                    </button>
                    <button className="cancel-button" type="button" onClick={handleClose}>
                        Cancel
                    </button>
                </form>
                
            </div>)}
        </div>
    );
};

export default SignUpModal;
