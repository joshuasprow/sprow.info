import { navigate } from "@reach/router";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db, newTimestamp, Timestamp, isPostViewer } from "./firebase";

interface AppContextType {
  authenticating: boolean;
  posts: PostDoc[];
  userDoc: UserDoc | null;
}

type UserRole = undefined | "admin" | "user";

export interface UserDoc {
  creationTime: Timestamp;
  displayName: string | null;
  email: string;
  lastSignInTime: Timestamp;
  role: UserRole;
  userId: string;
}

export interface PostDoc {
  creationTime: Timestamp;
  message: string;
  postId: string;
  updateTime: null | Timestamp;
  userId: string;
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
  userId,
}: Pick<UserDoc, "lastSignInTime" | "userId">) =>
  db
    .collection("users")
    .doc(userId)
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

    let unsubUser: () => void;

    auth.onAuthStateChanged(async (u) => {
      setFirebaseUser(u);

      if (!u) {
        setAuthenticating(false);
        setUserDoc(null);
        navigate("/");
        return;
      }

      await updateLastLogin({
        lastSignInTime: newTimestamp(),
        userId: u.uid,
      });

      const ref = db.doc(`users/${u.uid}`);
      const doc = (await ref.get()).data();

      setUserDoc(doc as UserDoc);
      setAuthenticating(false);

      navigate("posts");

      unsubUser = ref.onSnapshot((doc) => {
        setUserDoc(doc.data() as UserDoc);
      });

      console.log("user: subscribe");
    });

    return () => {
      if (unsubUser) {
        console.log("user: unsubscribe");
        unsubUser();
      }
    };
  }, []);

  useEffect(() => {
    let unsubPosts: () => void;

    if (firebaseUser && userDoc && isPostViewer(userDoc)) {
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
