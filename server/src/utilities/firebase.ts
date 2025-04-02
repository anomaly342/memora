import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const { FIREBASE_PRIVATE_KEY, CLIENT_EMAIL, STORAGE_BUDGET } =
  process.env as Record<any, string>;

const serviceAccount: ServiceAccount = {
  projectId: 'memora-31e1c',
  privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Escape new lines
  clientEmail: CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: STORAGE_BUDGET,
});

const bucket = admin.storage().bucket();

export { admin, bucket };
