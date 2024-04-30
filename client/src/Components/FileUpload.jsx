import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import axios from 'axios'; // Import Axios
import './FileUpload.css';

const FileUpload = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [fileData, setFileData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.name) {
      setUserName(location.state.name);
      setUserEmail(location.state.email);
      getFileNames();
    }
  }, [location]);

  const getFileNames = async () => {
    try {
      const response = await axios.post('http://localhost:8000/decrypt', {
        email: userEmail
      });
      setFileData(response.data.fileNames);
    } catch (error) {
      console.error('Error retrieving file names:', error);
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    return navigate('/');
  };

  const handleFileUpload = async (event) => {
    const fileList = event.target.files;
  
    // Create form data object
    const formData = new FormData();
    Array.from(fileList).forEach((file) => {
      formData.append('file', file); // Append each file to the form data with key 'file'
    });
  
    // Retrieve email from state or wherever it's stored
   
    // Append email to formData
    formData.append('email', userEmail);
  
    try {
      const response = await fetch('http://localhost:8000/encrypt', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  return (
    <div className="FileUpload">
      <header>
        <div className='container'>
          <div className='header-content'>
            <div className='user-info'>
              <div className='userName'><div className='welocome'>Hi, </div> {userName}</div>
              <div className="dropdown">
                  <a className='logOut' onClick={handleLogout}>Log out</a>
              </div>
            </div>
            <div className="text-center">
              <h1>File Upload</h1>
              <p>Securely upload and share your files. Fast. Easy. Reliable.</p>
              <input type="file" className="upload-button" onChange={handleFileUpload} multiple />
            </div>
          </div>
        </div>
      </header>
      <div className="container">
        <h2 className='tableHeading'>Uploaded files</h2>
        <div className="tabs">
          <button className={`tab ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => handleTabChange('personal')}>Personal</button>
          <button className={`tab ${activeTab === 'public' ? 'active' : ''}`} onClick={() => handleTabChange('public')}>Public</button>
        </div>
        <div className="tab-content">
          {activeTab === 'personal' && (
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fileData.map((file, index) => (
                  <tr key={index}>
                    <td>{file.name}</td>
                    <td>{file.date}</td>
                    <td><FaDownload className="download-icon" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'public' && (
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
              {fileData.map((file, index) => (
                  <tr key={index}>
                    <td>{file.name}</td>
                    <td>{file.uploadedBy}</td>
                    <td>{file.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
