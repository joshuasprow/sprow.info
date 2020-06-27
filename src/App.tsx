import React from "react";
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
