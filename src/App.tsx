import React from "react";
import LoginButton from "./components/LoginButton";
import PostForm from "./components/PostForm";
import Posts from "./components/Posts";
import { AppProvider } from "./context";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <LoginButton />
        <PostForm />
        <Posts />
      </div>
    </AppProvider>
  );
}

export default App;
