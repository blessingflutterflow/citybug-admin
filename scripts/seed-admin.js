// This script creates the default admin user in Firebase Auth
// Run with: node scripts/seed-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyAQZOwYp_-03v9zqmH9hGliKMldhfzBCNQ",
  authDomain: "festo-ee0a4.firebaseapp.com",
  projectId: "festo-ee0a4",
  storageBucket: "festo-ee0a4.firebasestorage.app",
  messagingSenderId: "1086272718593",
  appId: "1:1086272718593:android:acd0750de0daef221a7d00"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ADMIN_EMAIL = 'admin@citybug.app';
const ADMIN_PASSWORD = 'admin123';

async function seedAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Admin user created successfully!');
    console.log('UID:', userCredential.user.uid);
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Admin user already exists');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  }
  process.exit(0);
}

seedAdmin();
