import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
export default function Upload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  //Function that handles the uploading of the file
  const handleUpload = async () => {
    try {
        //Getting File Type
        const fileType = file.type; 
        const token = localStorage.getItem('jwtToken');
      console.log(`File type is:${file.type}`);
        const response  = await axios.post('https://us-central1-cloudfunctiontest-437414.cloudfunctions.net/activity_2_file_upload',file,{
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type': file.type
            }
        }); 
      if (response.status === 200) {
        
        alert('File uploaded successfully!');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  //Fucntion to navigate to the login page upong click
  const handleSignOut = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {}
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">Image Upload</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/gallery')}
          >
            Go to Gallery
          </button>
          <button
              className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
        </div>
      </nav>

      {}
      <div className="flex items-center justify-center mt-10">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
          <input
            type="file"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 mt-4 rounded"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
