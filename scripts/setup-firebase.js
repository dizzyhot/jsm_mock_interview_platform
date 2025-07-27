#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔥 Firebase Setup for PrepWise\n");

console.log(
  "This script will help you set up Firebase authentication for your project.\n"
);

console.log("Option 1: Local Development (Recommended)");
console.log(
  "1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install"
);
console.log("2. Run: gcloud auth application-default login");
console.log("3. Select your Firebase project when prompted\n");

console.log("Option 2: Service Account Credentials");
console.log("1. Go to Firebase Console → Project Settings → Service Accounts");
console.log('2. Click "Generate new private key"');
console.log("3. Download the JSON file");
console.log("4. Create a .env.local file with the following variables:\n");

const envTemplate = `# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour private key here\\n-----END PRIVATE KEY-----\\n"
`;

console.log(envTemplate);

console.log(
  "Note: For local development, Option 1 (gcloud auth) is recommended as it's more secure."
);
console.log(
  "Option 2 should be used for production deployments or when ADC is not available.\n"
);

console.log("After setup, restart your development server: npm run dev");
