const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'busapp-2f73d.appspot.com',
});

const bucket = admin.storage().bucket();

async function uploadImageToFirebase(base64Image, contentType) {
  try {
    const filename = `images/${uuidv4()}.${contentType.split('/')[1]}`;

    const imageBuffer = Buffer.from(base64Image, 'base64');

    const file = bucket.file(filename);

    await file.save(imageBuffer, {
      metadata: {
        contentType: contentType,
      },
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', 
    });

    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

module.exports = { uploadImageToFirebase };