import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './Components/FileUpload';
import Login from './Components/Login';
import TwoStepVerication from './Components/TwoStepVerfication'

import './index.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/verify" element={<TwoStepVerication />} />
                <Route path="/file-upload" element={<FileUpload />} />
            </Routes>
        </Router>
    );
};

export default App;