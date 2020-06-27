import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

const db = admin.firestore();

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    await db.collection("users").doc(user.uid).set({
      creationTime: user.metadata.creationTime,
      displayName: user.displayName,
      email: user.email,
      lastSignInTime: user.metadata.lastSignInTime,
      uid: user.uid,
    });
  } catch (error) {
    console.error(error);
  }
});

exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    await db.doc(`users/${user.uid}`).delete();
  } catch (error) {
    console.error(error);
  }
});
