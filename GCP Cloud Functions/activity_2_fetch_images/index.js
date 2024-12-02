// Firebase admin, uuid and jsonwebtoken dependencies are required for the below GCP cloud function
// Below GCP cloud function fetches the images uploaded by the respective user email
const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
admin.initializeApp();

const storage = new Storage();
// The bucket where the user uploaded images are stored
const bucketName = 'serverless_activity_2';

// Function that will return the URL for the image based on the fileName
async function generateImageUrl(fileName) {
  /* In case if we need the signed URL, just for the reference
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };*/
  //const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}

exports.fetchImages = async (req, res) => {
    //CORS configuration
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
    }
   try {
    //Fetching the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];
    //Decoding the token
    const decoded = jwt.decode(token);
    //Fetching the email from the decoded token
    const email = decoded.email;
    
    // Querying the items collection 
    // Returns all the records for the given email from the 'items' collection in the Firestore (default) databaseId
    const userImagesSnapshot = await admin.firestore()
      .collection('items')
      .where('email', '==', email)
      .get();

    console.log('The images fetched are:');
    console.log(userImagesSnapshot);
    const imageUrls = [];
    // Generating the url for each of the image record
    for (const doc of userImagesSnapshot.docs) {
      const fileName = doc.data().fileName;
      console.log('Generating the image Url for:')
      console.log(fileName);
      const url = await generateImageUrl(fileName);
      imageUrls.push(url);
    }

    res.status(200).json({ imageUrls });
  } catch (error) {
    // Logging the error and returning the 500 status code
    console.error(error);
    res.status(500).send('Internal server error');
  }
};