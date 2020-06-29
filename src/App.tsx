import {
  Container,
  createMuiTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import ActionsDrawer from "./components/ActionsDrawer";
import Posts from "./pages/Posts";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./context";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({ palette: { type: prefersDarkMode ? "dark" : "light" } }),
    [prefersDarkMode]
  );

  const { isSmallScreen } = useAppContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container className="app" disableGutters={isSmallScreen}>
        <Router>
          <SignIn path="/" />
          <Posts path="posts" />
        </Router>
        <ActionsDrawer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
