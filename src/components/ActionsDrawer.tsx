import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { Link } from "@reach/router";
import React, { FC, useState } from "react";
import { useAppContext } from "../context";
import { auth, isPostViewer } from "../firebase";
import "./ActionsDrawer.css";

const ActionsDrawer: FC = () => {
  const { userDoc } = useAppContext();

  const [open, setOpen] = useState(false);

  const signOut = async () => {
    setOpen(false);

    auth.signOut();
  };

  const toggleDrawer = (nextOpen: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === "keydown" &&
      "key" in event &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(nextOpen);
  };

  return (
    <>
      <IconButton className="drawer-button" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="right"
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        open={open}
      >
        <List>
          {userDoc ? (
            <>
              <ListItem>
                <ListItemText>
                  {`Hi, ${userDoc.displayName || userDoc.email}`}
                </ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemText onClick={signOut}>Sign Out</ListItemText>
              </ListItem>
              <Divider />
              <Link to="/">
                <ListItem button onClick={toggleDrawer(false)}>
                  <ListItemText>Home</ListItemText>
                </ListItem>
              </Link>
              {isPostViewer(userDoc) && (
                <Link to="posts">
                  <ListItem button onClick={toggleDrawer(false)}>
                    <ListItemText>Posts</ListItemText>
                  </ListItem>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/">
                <ListItem button onClick={toggleDrawer(false)}>
                  <ListItemText>Home</ListItemText>
                </ListItem>
              </Link>
            </>
          )}
        </List>
      </SwipeableDrawer>
    </>
  );
};

export default ActionsDrawer;
