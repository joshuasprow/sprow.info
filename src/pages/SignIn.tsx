import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase, { auth } from "../firebase";
import { PageProps } from "./types";
import { useAppContext } from "../context";

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

const SignIn: PageProps = () => {
  const { authenticating, userDoc } = useAppContext();

  if (authenticating) {
    return <div>authenticating...</div>;
  }

  if (userDoc) {
    return (
      <div>
        <h1>this is you</h1>
        <pre>{JSON.stringify(userDoc, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>please sign in to continue</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
};

export default SignIn;
