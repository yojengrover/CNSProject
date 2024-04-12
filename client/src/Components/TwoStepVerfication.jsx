import React from 'react';
import './TwoStepVerification.css';

const TwoStepVerification = () => {
    return (
      <div className="dialog-box">
        <div className="main">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Enter your code</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your 6-digit verification code
            </p>
          </div>
          <div className="space-y-2">
            <input
              className="code-input"
              id="code"
              placeholder="Enter your code"
            />
            <button className="verify-button">Verify</button>
          </div>
        </div>
      </div>
    );
  };
  
  

export default TwoStepVerification;