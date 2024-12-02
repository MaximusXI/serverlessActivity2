// Firebase admin dependency is required for the below GCP cloud function
// Below GCP cloud function delete the specific image uploaded by the respective user email
const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK and Cloud Storage
admin.initializeApp();
const firestore = admin.firestore();
const storage = new Storage();
// The bucket where the images are stored
const BUCKET_NAME = 'serverless_activity_2';

exports.deleteImage = async (req, res) => {
  // CORS configuration
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') {
    // For Pre-flight reqeusts
    res.status(204).send('');
    return;
  }

  try {
    // Check if fileName is provided in the request
    const { fileName } = req.body;
    if (!fileName) {
      return res.status(400).send({ message: 'fileName is required' });
    }

    // Step 1: Delete image from Cloud Storage
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    await file.delete();
    console.log(`Image ${fileName} deleted from Cloud Storage`);

    // Step 2: Delete metadata from Firestore collection 'items'
    const itemsRef = firestore.collection('items');
    const querySnapshot = await itemsRef.where('fileName', '==', fileName).get();
    
    if (querySnapshot.empty) {
      return res.status(404).send({ message: 'Metadata not found for this file' });
    }

    // Delete each document that matches
    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
      console.log(`Metadata for ${fileName} deleted from Firestore`);
    });
    // Returning the successfull response
    return res.status(200).send({ message: 'Image deleted successfully' });

  } catch (error) {
    // Logging the error and returning the 500 status code
    console.error(error);
    res.status(500).send({ message: 'Internal server error', error: error.message });
  }
};