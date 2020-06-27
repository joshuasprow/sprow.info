import React, {
  createContext,
  FC,
  useEffect,
  useState,
  useContext,
} from "react";
import { auth, db } from "./firebase";

export interface IAppContext {
  posts: IPostDoc[];
  user: firebase.User | null;
}

interface IUserDoc
  extends Pick<firebase.User, "displayName" | "email" | "uid"> {
  creationTime: Date;
  lastSignInTime: Date;
}

export interface IPostDoc {
  creationTime: Date;
  message: string;
  uid: string;
  user?: IUserDoc;
}

const initialContext: IAppContext = {
  posts: [],
  user: null,
};

const updateLastLogin = async ({
  lastSignInTime,
  uid,
}: Pick<IUserDoc, "lastSignInTime" | "uid">) =>
  db
    .collection("users")
    .doc(uid)
    .update({ lastSignInTime })
    .catch(console.error);

export const AppContext = createContext(initialContext);
AppContext.displayName = "AppContext";

export const useAppContext = () => useContext(AppContext);

export const AppProvider: FC = (props) => {
  const [posts, setPosts] = useState<IPostDoc[]>([]);
  const [user, setUser] = useState<IAppContext["user"]>(null);

  useEffect(() => {
    auth().onAuthStateChanged(
      async (user) => {
        setUser(user);

        if (user) {
          await updateLastLogin({ lastSignInTime: new Date(), uid: user.uid });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    let unsubscribe: () => void;

    if (user) {
      unsubscribe = db
        .collection("posts")
        .onSnapshot({ includeMetadataChanges: true }, (snap) => {
          const nextPosts: IPostDoc[] = [];

          snap.forEach((doc) => {
            console.log(doc.data());
            nextPosts.push(doc.data() as IPostDoc);
          });

          setPosts(nextPosts);
        });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return <AppContext.Provider {...props} value={{ posts, user }} />;
};
