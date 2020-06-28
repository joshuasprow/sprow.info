import { Link, Router, Redirect } from "@reach/router";
import React from "react";
import { AppConsumer, AppProvider } from "./context";
import { auth } from "./firebase";
import Posts from "./pages/Posts";
import SignIn from "./pages/SignIn";

function App() {
  const signOut = () => auth.signOut();

  return (
    <AppProvider>
      <AppConsumer>
        {({ authenticating, userDoc }) => (
          <div className="App">
            <ul>
              {userDoc && (
                <li>
                  <button onClick={signOut}>sign out</button>
                </li>
              )}
              <Link to="/">
                <li>sign-in</li>
              </Link>
              {userDoc?.role === "admin" && (
                <Link to="posts">
                  <li>posts</li>
                </Link>
              )}
            </ul>
            <Router>
              <SignIn path="/" />
              <Posts path="posts" />
            </Router>
          </div>
        )}
      </AppConsumer>
    </AppProvider>
  );
}

export default App;
