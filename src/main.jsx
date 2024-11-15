import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, Routes,RouterProvider,BrowserRouter } from 'react-router-dom'
import Login from '../components/Login.jsx'
import Upload from '../components/Upload.jsx'
import Images from '../components/Images.jsx'
import ReactDOM from 'react-dom/client';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Login type="signup" />} />
        <Route path="/login" element={<Login type="login" />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/gallery" element={<Images />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
