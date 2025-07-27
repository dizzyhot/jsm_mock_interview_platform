import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    // Check if we have service account credentials in environment variables
    const hasServiceAccount =
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY;

    if (hasServiceAccount) {
      // Use service account credentials if available
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      // Use Application Default Credentials (ADC) for local development
      // This will use gcloud auth application-default login or GOOGLE_APPLICATION_CREDENTIALS
      initializeApp({
        credential: applicationDefault(),
        projectId: "prepwise-170bb", // Use the project ID from client config
      });
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

export const { auth, db } = initFirebaseAdmin();
