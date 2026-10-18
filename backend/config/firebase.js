const admin = require("firebase-admin");

let db = null;
let initError = null;

function initializeFirebase() {
  if (db) return db;
  if (initError) throw initError;

  try {
    if (admin.apps.length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "Firebase 환경변수가 설정되지 않았습니다."
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n")
        })
      });
    }

    db = admin.firestore();
    return db;
  } catch (error) {
    initError = error;
    throw error;
  }
}

function getDb() {
  if (!db) return initializeFirebase();
  return db;
}

module.exports = {
  admin,
  getDb
};
