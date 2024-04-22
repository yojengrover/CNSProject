import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FileUpload.css';

const FileUpload = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [userName, setUserName] = useState('');
  const [fileData, setFileData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.name) {
      setUserName(location.state.name);
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    // Redirect to the login page
    return navigate('/');
  };

  const handleFileUpload = (event) => {
    const fileList = event.target.files;
    // Convert the FileList to an array and add it to fileData state
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      uploadedBy: userName,
      date: new Date().toISOString().split('T')[0] // Get the current date in YYYY-MM-DD format
    }));
    setFileData([...fileData, ...newFiles]);
  };

  return (
    <div className="FileUpload">
      <header>
        <div className='container'>
          <div className='header-content'>
            <div className='user-info'>
              <div className='userName'><div className='welocome'>Hi, </div> {userName}</div>
              {/* Dropdown menu for user options */}
              <div className="dropdown">
                  <a className='logOut' onClick={handleLogout}>Log out</a>
                
              </div>
            </div>
            <div className="text-center">
              <h1>File Upload</h1>
              <p>Securely upload and share your files. Fast. Easy. Reliable.</p>
              {/* File input element for uploading files */}
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
                </tr>
              </thead>
              <tbody>
                {/* Map over fileData to display uploaded files */}
                {fileData.map((file, index) => (
                  <tr key={index}>
                    <td>{file.name}</td>
                    <td>{file.date}</td>
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