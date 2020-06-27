import React, { useContext, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { AppContext } from "../context";
import { firebase } from "../firebase";

const uiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

export default function LoginButton() {
  const { user } = useContext(AppContext);
  const [visible, setVisible] = useState(false);

  const signOut = () => firebase.auth().signOut();

  const show = () => setVisible(true);

  if (user) return <button onClick={signOut}>logout</button>;

  if (!visible) return <button onClick={show}>login</button>;

  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
}
