import React, { createContext, FC, useEffect, useState } from "react";
import { firebase } from "./firebase";

export interface IAppContext {
  user: firebase.User | null;
}

const initialContext: IAppContext = {
  user: null,
};

export const AppContext = createContext(initialContext);
AppContext.displayName = "AppContext";

export const AppProvider: FC = (props) => {
  const [user, setUser] = useState<IAppContext["user"]>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(
      (user) => {
        console.log(user);

        setUser(user);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return <AppContext.Provider {...props} value={{ user }} />;
};
