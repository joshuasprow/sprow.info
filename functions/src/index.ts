import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

exports.handleNewUser = functions.auth.user().onCreate(async (user) => {
  const userDoc = {
    created: user.metadata.creationTime,
    displayName: user.displayName,
    email: user.email,
    role: "user",
  };

  await admin.firestore().doc(`users/${user.uid}`).create(userDoc);
});
