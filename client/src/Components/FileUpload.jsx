import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="FileUpload">
      <header>
        <div className="container text-center">
          <h1>File Upload</h1>
          <p>Securely upload and share your files. Fast. Easy. Reliable.</p>
          <button className="upload-button">Upload Files</button>
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
                  <th>Uploaded By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Document.pdf</td>
                  <td>John Doe</td>
                  <td>2024-04-15</td>
                </tr>
                <tr>
                  <td>Image.jpg</td>
                  <td>Jane Smith</td>
                  <td>2024-04-14</td>
                </tr>
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
                <tr>
                  <td>Presentation.pptx</td>
                  <td>Alice Johnson</td>
                  <td>2024-04-13</td>
                </tr>
                <tr>
                  <td>Spreadsheet.xlsx</td>
                  <td>Bob Williams</td>
                  <td>2024-04-12</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
