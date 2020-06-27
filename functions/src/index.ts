import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

const db = admin.firestore();

exports.onUserCreate = functions.auth.user().onCreate((user) =>
  db.doc(`users/${user.uid}`).create({
    creationTime: user.metadata.creationTime,
    displayName: user.displayName,
    email: user.email,
    lastSignInTime: user.metadata.lastSignInTime,
    uid: user.uid,
    x: user.providerData,
  })
);

exports.onUserDelete = functions.auth
  .user()
  .onDelete((user) => db.doc(`users/${user.uid}`).delete());
