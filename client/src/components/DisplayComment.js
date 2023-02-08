import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Link } from "react-router-dom";
const DisplayComment = ({ comment }) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${comment.user}`)
      .then((res) => setUsername(res.data.user.username))
      .catch((err) => console.error(err));
  });
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Link
            to={`/user/${comment.user}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Avatar aria-label="avatar">{username ? username[0] : null}</Avatar>
          </Link>
        </ListItemAvatar>
        <Typography
          className="comment"
          variant="body2"
          style={{ fontWeight: "900" }}
          component="span"
        >
          <Link
            to={`/user/${comment.user}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            {username}
          </Link>
          <ListItemText
            primary={comment.message}
            secondary={
              Math.floor(
                (new Date() - new Date(comment.createdAt)) / 86400000
              ) + "d"
            }
          />
        </Typography>
      </ListItem>
    </List>
  );
};

export default DisplayComment;
