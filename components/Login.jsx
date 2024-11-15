import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login({type=''}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  //Function to handle the login when clicked
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = type === 'signup' ? 'https://us-central1-cloudfunctiontest-437414.cloudfunctions.net/activity_2_signup' : 'https://us-central1-cloudfunctiontest-437414.cloudfunctions.net/activity_2_login';
      const response = await axios.post(url, { email, password },{});
      console.log(response);
      if (type === 'login') {
    //const responseBody = JSON.parse(response.data.body);
    if (response.status === 200) {
        console.log(response);
        const token = response.data.token;
        // Storing the JWT token in local storage
        localStorage.setItem('jwtToken', token);
        console.log('Login successful, token stored:', token);
        navigate('/upload');
    } else {
        console.error('Login failed:', response.data);
      }
    } else {
      alert('Sign up successful! Please log in.');
      navigate('/login');
    }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
      <h2 className="text-2xl font-bold mb-4">{type === 'signup' ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          {type === 'signup' ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-black font-semibold py-2 rounded-lg shadow-lg transition duration-300"
          >
            Back
          </button>
        </div>
    </div>
  </div>
  )
}

export default Login