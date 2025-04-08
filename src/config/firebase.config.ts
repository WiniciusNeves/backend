import * as admin from 'firebase-admin';
import { join } from 'path';
import { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config({ path: join(__dirname, '../../.env') });


const serviceAccount = require(join(__dirname, '../../src/secrets', 'firebase-service-account.json')) as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

export { admin, bucket };
