// Firebase admin, uuid and jsonwebtoken dependencies are required for the below GCP cloud function
// Below GCP cloud function uploads the image to the cloud storage bucket and stores the information about the user who uploaded it in Firestore
const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

// Initializing the Firebase Admin SDK
admin.initializeApp();
const firestore = admin.firestore();
const storage = new Storage();
// The bucket where the images are stored on the cloud storage
const BUCKET_NAME = 'serverless_activity_2';

exports.uploadImage = async (req, res) => {
    //CORS configuration
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
    }
   try {
    // Get JWT token from headers and decode it
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Authorization token missing');

    const decoded = jwt.decode(token);
    // Fetching the email from the decoded token
    const email = decoded.email;
    if (!email) return res.status(401).send('Invalid token');

    // Getting the image data and MIME type from request
    const contentType = req.headers['content-type'];

    //Getting the file Extension e.g., "jpeg" for "image/jpeg"
    const fileExtension = contentType.split('/')[1];  
    const fileName = `${uuidv4()}.${fileExtension}`;
    // Check if the request body is in the form of base64 data
    let fileBuffer;
    if (typeof req.body === 'string') {
      // Parse base64 encoded image
      fileBuffer = Buffer.from(req.body, 'base64');
    } else if (Buffer.isBuffer(req.body)) {
      // Parse binary data directly
      fileBuffer = req.body;
    } else {
      return res.status(400).send('Invalid image data format.');
    }

    // Upload image to Cloud Storage
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    await file.save(fileBuffer, { contentType });

    // Add metadata to Firestore
    // Here each uploaded image will be linked with the email of the user who uploaded in the 'items' collections
    await firestore.collection('items').add({
      email: email,
      fileName: fileName,
      uploadedAt: admin.firestore.Timestamp.now()
    });

    return res.status(200).send({ message: 'Image uploaded successfully', fileName });
  } catch (error) {
    // Logging the error and returning the 500 status code 
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
