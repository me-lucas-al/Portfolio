import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const isDevelopment = process.env.NODE_ENV === "development";

if (isDevelopment && !process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";
}

function getFirebaseCredentials() {
  const projectId = process.env.GCP_PROJECT ?? process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  return undefined;
}

function getFirebaseApp(): App {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  const projectId = process.env.GCP_PROJECT ?? process.env.FIREBASE_PROJECT_ID;
  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET ??
    (projectId ? `${projectId}.appspot.com` : undefined);

  return initializeApp({
    credential: getFirebaseCredentials(),
    projectId,
    storageBucket,
  });
}

export function getFirebaseStorageBucket() {
  return getStorage(getFirebaseApp()).bucket();
}

export function isFirebaseStorageEmulator() {
  return isDevelopment;
}

export function getFirebaseStorageEmulatorPublicHost() {
  return process.env.FIREBASE_STORAGE_EMULATOR_PUBLIC_HOST ?? "localhost:9199";
}
