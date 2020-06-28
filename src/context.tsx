import { navigate } from "@reach/router";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db, newTimestamp, Timestamp } from "./firebase";

interface AppContextType {
  authenticating: boolean;
  posts: PostDoc[];
  userDoc: UserDoc | null;
}

type UserRole = undefined | "admin";

interface UserDoc extends Pick<firebase.User, "displayName" | "email" | "uid"> {
  creationTime: Timestamp;
  lastSignInTime: Timestamp;
  role: UserRole;
}

export interface PostDoc {
  creationTime: Timestamp;
  message: string;
  uid: string;
}

const initialContext: AppContextType = {
  authenticating: true,
  posts: [],
  userDoc: null,
};

const AppContext = createContext(initialContext);

AppContext.displayName = "AppContext";

export const useAppContext = () => useContext(AppContext);

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

  const [authenticating, setAuthenticating] = useState(
    initialContext.authenticating
  );
  const [posts, setPosts] = useState<PostDoc[]>(initialContext.posts);
  const [userDoc, setUserDoc] = useState<AppContextType["userDoc"]>(
    initialContext.userDoc
  );

  useEffect(() => {
    console.log("context mounted");

    let userSet = false;
    let unsubUser: () => void;

    auth.onAuthStateChanged(
      async (u) => {
        setFirebaseUser(u);

        if (!u) {
          setAuthenticating(false);
          setUserDoc(null);
          navigate("/");
          return;
        }

        await updateLastLogin({
          lastSignInTime: newTimestamp(),
          uid: u.uid,
        });

        unsubUser = db.doc(`users/${u.uid}`).onSnapshot((doc) => {
          setUserDoc(doc.data() as UserDoc);

          if (userSet === false) {
            userSet = true;
            setAuthenticating(false);
          }
        });

        console.log("user: subscribe");
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      if (unsubUser) {
        console.log("user: unsubscribe");
        unsubUser();
      }
    };
  }, []);

  useEffect(() => {
    let unsubPosts: () => void;

    if (firebaseUser && userDoc && userDoc.role === "admin") {
      unsubPosts = db
        .collection("posts")
        .orderBy("creationTime", "desc")
        .limit(100)
        .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
          const nextPosts: PostDoc[] = [];

          querySnapshot.forEach((doc) => {
            nextPosts.push(doc.data() as PostDoc);
          });

          setPosts(nextPosts);
        });
      console.log("posts: subscribe");
    }

    return () => {
      if (unsubPosts) {
        unsubPosts();
        console.log("posts: unsubscribe");
      }
    };
  }, [firebaseUser, userDoc]);

  return (
    <AppContext.Provider
      {...props}
      value={{ authenticating, posts, userDoc }}
    />
  );
};
