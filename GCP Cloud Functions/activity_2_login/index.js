// Firestore, bcryptJs and jsonwebtoken dependencies are required for the below GCP cloud function
// Below GCP cloud function handles the Login request from the users and issues the JWT token.
const { Firestore } = require('@google-cloud/firestore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const firestore = new Firestore();
// The collection in which the user data is stored 
const usersCollection = firestore.collection('users');

// Secret key for signing JWT
const JWT_SECRET = process.env.SECRET_KEY;

exports.login = async (req, res) => {
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

    // Check if the email exists in Firestore
    const userSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
    if (userSnapshot.empty) {
      // User with this email does not exist
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Retrieve user data
    const userData = userSnapshot.docs[0].data();

    // Comparing the hashed password with the one supplied in the request
    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);
    if (!isPasswordValid) {
      // Password does not match then return the 400 status code with error message
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful!',
      token: token
    });
  } catch (error) {
    // Logging the error and returning the 500 status code
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Error logging in user.' });
  }
};
