import React from "react";
import "./App.css";
import LoginButton from "./components/LoginButton";
import { AppProvider } from "./context";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <LoginButton />
      </div>
    </AppProvider>
  );
}

export default App;
