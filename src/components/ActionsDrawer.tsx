import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Avatar,
  ListItemAvatar,
} from "@material-ui/core";
import {
  Forum as ForumIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
} from "@material-ui/icons";
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
              <ListItem
                button
                component={Link}
                onClick={toggleDrawer(false)}
                to="/"
              >
                <ListItemAvatar>
                  <Avatar>
                    <HomeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>Home</ListItemText>
              </ListItem>
              {isPostViewer(userDoc) && (
                <ListItem
                  button
                  component={Link}
                  onClick={toggleDrawer(false)}
                  to="posts"
                >
                  <ListItemAvatar>
                    <Avatar>
                      <ForumIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>Posts</ListItemText>
                </ListItem>
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
