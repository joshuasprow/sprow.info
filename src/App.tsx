import {
  Container,
  createMuiTheme,
  ThemeProvider,
  useMediaQuery,
  CssBaseline,
} from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import ActionsDrawer from "./components/ActionsDrawer";
import { AppProvider } from "./context";
import Posts from "./pages/Posts";
import SignIn from "./pages/SignIn";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({ palette: { type: prefersDarkMode ? "dark" : "light" } }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Container className="app">
          <ActionsDrawer />
          <Router>
            <SignIn path="/" />
            <Posts path="posts" />
          </Router>
        </Container>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
