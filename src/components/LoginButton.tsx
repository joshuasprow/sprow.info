import React, { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useAppContext } from "../context";
import firebase, { auth } from "../firebase";

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

const LoginButton = () => {
  const { user } = useAppContext();
  const [visible, setVisible] = useState(false);

  const signOut = () => auth.signOut();

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  if (user) return <button onClick={signOut}>logout</button>;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={show}
        style={{
          height: "1.5rem",
          position: "absolute",
        }}
      >
        log in
      </button>
      <div
        style={{
          background: "white",
          border: "1px solid black",
          display: visible ? "block" : "none",
          position: "absolute",
          top: "1.5rem",
        }}
      >
        <button onClick={hide} style={{ float: "right" }}>
          x
        </button>
        <div style={{ float: "left" }}>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
      </div>
    </div>
  );
};

export default LoginButton;
