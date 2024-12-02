// Firestore and bcryptJs dependencies are required for the below GCP cloud function
// Below GCP cloud function handles the Signup request from the users.
const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const bcrypt = require('bcryptjs');
const firestore = new Firestore();
// The collection in which the user data is stored 
const usersCollection = firestore.collection('users');

exports.signup = async (req, res) => {
    //CORS configuration
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
try {
    //Fetching the email  and password from the request body
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if the email already exists
    const userSnapshot = await usersCollection.where('email', '==', email).get();
    if (!userSnapshot.empty) {
      // Email already exists in Firestore 'users' collection so return the 400 status code
      return res.status(400).json({ message: 'User already registered.' });
    }

    // Encrypting the password with round 5
    const hashedPassword = await bcrypt.hash(password, 5);

    // Save the email and hashed password to Firestore 'users' collection
    await usersCollection.add({
      email: email,
      hashedPassword: hashedPassword,
      registeredOn: new Date().toISOString()
    });

    return res.status(200).json({ message: 'User registered successfully!' });
}  catch (error) {
    // If some error occurs then logging the error and returning the 500 status code 
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Error registering user.' });
  }
};
