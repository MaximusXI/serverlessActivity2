import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Outlet} from 'react-router-dom'
import { Link } from 'react-router-dom';
function App() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Image Gallery App Activity 2</h1>
        <div className="space-y-4">
          <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign Up
          </Link>
          <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
