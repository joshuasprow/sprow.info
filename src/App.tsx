import { Link, Router } from "@reach/router";
import React from "react";
import { AppConsumer, AppProvider } from "./context";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import LoginButton from "./components/LoginButton";

function App() {
  return (
    <AppProvider>
      <AppConsumer>
        {({ user }) => (
          <div className="App">
            <ul>
              <li>
                <LoginButton />
              </li>
              <Link to="/">
                <li>home</li>
              </Link>
              {user && (
                <Link to="posts">
                  <li>posts</li>
                </Link>
              )}
            </ul>
            <Router>
              <Home path="/" />
              <Posts path="posts" />
            </Router>
          </div>
        )}
      </AppConsumer>
    </AppProvider>
  );
}

export default App;
