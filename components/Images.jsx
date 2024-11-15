import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
export default function Images() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post('https://us-central1-cloudfunctiontest-437414.cloudfunctions.net/activity_2_fetch_images',
            {

            },{
              headers:{
                'Authorization':`Bearer ${token}`
              }
            });
        console.log(response)
        setImages(response.data.imageUrls);  
      } catch (error) {
        alert('Error: ' + error.message);
      }
    };
    fetchImages();
  }, []);

  const handleDelete = async (image) => {
      console.log(image)
      console.log(image.split('/'));
      const parts = image.split('/');
      console.log(parts[parts.length - 1]);
      const fileName = parts[parts.length - 1];
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post('https://us-central1-cloudfunctiontest-437414.cloudfunctions.net/activity_2_file_delete',
        {
          fileName:fileName
        },{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
      console.log(response);
      if(response.status === 200){
        const newArray = images.filter(item => item !== image);
        setImages(newArray);
        alert('File Deleted successfully!');
      }
  };

  return (
    <>
    <div className='w-full'>
    <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">Image Upload</h1>
          <button
            className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/upload')}
          >
            Back
          </button>
        </div>
      </nav>
    </div>
    
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Your Uploaded Images</h2>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <div key={image} className="relative">
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(image)}
              className=" bg-black w-full h-40 text-red px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
          ))}

        </div>
      </div>
    </div>
    </>
    
  );
}
