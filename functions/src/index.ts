import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

const db = admin.firestore();

const stringToTimestamp = (str: string) =>
  admin.firestore.Timestamp.fromDate(new Date(str));

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    await db
      .collection("users")
      .doc(user.uid)
      .set({
        creationTime: stringToTimestamp(user.metadata.creationTime),
        displayName: user.displayName,
        email: user.email,
        lastSignInTime: stringToTimestamp(user.metadata.lastSignInTime),
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
