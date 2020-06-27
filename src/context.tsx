import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db, Timestamp, newTimestamp } from "./firebase";

interface AppContextType {
  posts: PostDoc[];
  user: UserDoc | null;
}

interface UserDoc extends Pick<firebase.User, "displayName" | "email" | "uid"> {
  creationTime: Timestamp;
  lastSignInTime: Timestamp;
}

export interface PostDoc {
  creationTime: Timestamp;
  message: string;
  uid: string;
}

const initialContext: AppContextType = {
  posts: [],
  user: null,
};

export const AppContext = createContext(initialContext);

AppContext.displayName = "AppContext";

export const useAppContext = () => useContext(AppContext);

export const AppConsumer = AppContext.Consumer;

const updateLastLogin = async ({
  lastSignInTime,
  uid,
}: Pick<UserDoc, "lastSignInTime" | "uid">) =>
  db
    .collection("users")
    .doc(uid)
    .update({ lastSignInTime })
    .catch(console.error);

export const AppProvider: FC = (props) => {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null);

  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [user, setUser] = useState<AppContextType["user"]>(null);

  useEffect(() => {
    auth.onAuthStateChanged(
      async (u) => {
        setFirebaseUser(u);

        if (!u) return;

        await updateLastLogin({
          lastSignInTime: newTimestamp(),
          uid: u.uid,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    let unsubPosts: () => void;
    let unsubUser: () => void;

    if (firebaseUser) {
      unsubPosts = db
        .collection("posts")
        .orderBy("creationTime", "desc")
        .limit(100)
        .onSnapshot({ includeMetadataChanges: true }, (snap) => {
          const nextPosts: PostDoc[] = [];

          snap.forEach((doc) => {
            nextPosts.push(doc.data() as PostDoc);
          });

          setPosts(nextPosts);
        });

      unsubUser = db
        .doc(`users/${firebaseUser.uid}`)
        .onSnapshot({ includeMetadataChanges: true }, (doc) => {
          setUser(doc.data() as UserDoc);
        });
    }

    return () => {
      if (unsubPosts) unsubPosts();
      if (unsubUser) unsubUser();
    };
  }, [firebaseUser]);

  return <AppContext.Provider {...props} value={{ posts, user }} />;
};
