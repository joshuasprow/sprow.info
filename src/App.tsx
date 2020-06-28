import { Box, Container } from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import ActionsDrawer from "./components/ActionsDrawer";
import { AppProvider } from "./context";
import Posts from "./pages/Posts";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <AppProvider>
      <Container className="app">
        <ActionsDrawer />
        <Box className="content">
          <Router>
            <SignIn path="/" />
            <Posts path="posts" />
          </Router>
        </Box>
      </Container>
    </AppProvider>
  );
}

export default App;
