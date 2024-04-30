import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import './TwoStepVerification.css';

const SuccessModal = ({ message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
      </div>
    </div>
  );
};

const TwoStepVerification = () => {
  const [userVerificationCode, setVerificationCode] = useState('');
  
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleChange = (e) => {
    setVerificationCode(e.target.value);
    setError(''); // Clear any previous error when input value changes
  };
  
  const handleVerify = async(e) => {
    e.preventDefault();
    try {
      // Send name, email, and password to your server for authentication
      const response = await axios.post('http://localhost:8000/otp', {
        otp:userVerificationCode
      });
      // Assuming your server responds with a JSON object containing a 'success' property
      const { msg } = response.data;
      console.log(response.data);
      if (msg) {
          console.log('Authentication successful, navigating to FileUpload.jsx');
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate('/file-upload', { state: { name: location.state.name, email: location.state.email} });
      }, 500); // Redirect after 500ms
    } else {
      setError('Invalid verification code'); 
    }
  }
  catch (err){
    console.error(err.message);
}

    }
  return (
    <div className="dialog-box">
      {showSuccessModal ? <SuccessModal message="Verification successful! Redirecting..." /> : (
      <div className="main">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Enter your code</h1>
          <p className='otpText'>Check your email for a 4 digit OTP</p>
        </div>
        <div className="space-y-2">
          <input
            className="code-input"
            id="code"
            placeholder="Enter your code"
            value={userVerificationCode}
            onChange={handleChange}
          />
          {error && <p className="error-message">{error}</p>}
          <button className="verify-button" onClick={handleVerify}>
            Verify
          </button>
          
        </div>
      </div>)}
    </div>
  );
};
export default TwoStepVerification;
