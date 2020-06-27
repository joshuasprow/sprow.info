import React, { createContext, FC, useEffect, useState } from "react";
import { auth, db } from "./firebase";

export interface IAppContext {
  user: firebase.User | null;
}

interface IUserDoc
  extends Pick<firebase.User, "displayName" | "email" | "uid">,
    Pick<firebase.User["metadata"], "creationTime" | "lastSignInTime"> {}

const initialContext: IAppContext = {
  user: null,
};

const updateLastLogin = async (user: firebase.User) =>
  db
    .collection("users")
    .doc(user.uid)
    .update({ lastSignInTime: new Date() })
    .catch(console.error);

export const AppContext = createContext(initialContext);
AppContext.displayName = "AppContext";

export const AppProvider: FC = (props) => {
  const [user, setUser] = useState<IAppContext["user"]>(null);

  useEffect(() => {
    auth().onAuthStateChanged(
      async (user) => {
        setUser(user);

        if (user) await updateLastLogin(user);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return <AppContext.Provider {...props} value={{ user }} />;
};
