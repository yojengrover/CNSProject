import React, { useState } from 'react';
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
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
    setError(''); // Clear any previous error when input value changes
  };

  const handleVerify = () => {
    if (verificationCode === '1234') {
      setError('Invalid verification code'); // Set error message if code is '1234'
    } else {
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate('/file-upload', { state: { name: location.state.name } });
      }, 10000); // Redirect after 3 seconds
    }
  };

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
            value={verificationCode}
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
