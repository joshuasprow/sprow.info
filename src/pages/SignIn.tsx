import { Typography, TypographyProps, Box } from "@material-ui/core";
import React, { FC } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useAppContext } from "../context";
import firebase, { auth } from "../firebase";
import { PageProps } from "./types";

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

const Wrapper: FC = (props) => (
  <Box
    {...props}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="95vh"
  />
);

const H4: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography {...props} variant="h4" />
);

const SignIn: PageProps = () => {
  const { authenticating, userDoc } = useAppContext();

  if (authenticating) {
    return (
      <Wrapper>
        <H4>authenticating...</H4>
      </Wrapper>
    );
  }

  if (userDoc) {
    return (
      <Wrapper>
        <H4>this is you</H4>
        <pre>{JSON.stringify(userDoc, null, 2)}</pre>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <H4>please sign in to continue</H4>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </Wrapper>
  );
};

export default SignIn;
