import React, { Fragment, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteForever";

const DisplayComment = ({ comment }) => {
  const [username, setUsername] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleCommentDelete = () => {
    axios
      .delete(
        `http://localhost:3000/api/posts/${comment.post}/comments/${comment._id}`,
        config
      )
      .then((res) => window.location.reload())
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${comment.user}`)
      .then((res) => {
        setUsername(res.data.user.username);

        setPhotoPath(res.data.user.photoPath);
      })
      .catch((err) => console.error(err));
  });

  const handleCommentUpdate = () => {
    axios
      .put(
        `http://localhost:3000/api/posts/${comment.post}/comments/${comment._id}`,
        {
          message: message,
          user: localStorage.getItem("userId"),
          post: comment.post,
        },
        config
      )
      .then((res) => window.location.reload())
      .catch((err) => console.error(err));
  };

  const getTime = (time) => {
    const timePassed = new Date() - new Date(time);
    const days = Math.floor(timePassed / 86400000);
    if (days >= 1) {
      return days + "d";
    } else {
      const hours = Math.floor(timePassed / 3600000);
      if (hours >= 1) return hours + "h";
      const minutes = Math.floor(timePassed / 60000);
      if (minutes > 1) return minutes + "m";
    }
    return "1m";
  };

  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Link
            to={`/user/${comment.user}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            {photoPath ? (
              <Avatar alt="avatar" src={photoPath} />
            ) : (
              <Avatar sx={{ bgcolor: "#f44336" }} aria-label="avatar">
                {username ? username[0] : null}
              </Avatar>
            )}
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
            primary={
              <Fragment>
                {deleteMode ? (
                  <div style={{ position: "relative" }}>
                    <div className="delete-comment">
                      <Typography variant="p" size="small">
                        Are you sure you'd like to delete this comment?
                      </Typography>
                      <Button variant="contained" onClick={handleCommentDelete}>
                        Yes
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setDeleteMode(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                ) : null}
                {comment.message}
                {comment.user === localStorage.getItem("userId") ? (
                  <div>
                    <EditIcon onClick={() => setEditMode(true)} />
                    <DeleteIcon onClick={() => setDeleteMode(true)} />
                  </div>
                ) : null}
              </Fragment>
            }
            secondary={getTime(comment.createdAt)}
          />
        </Typography>
      </ListItem>
      {editMode ? (
        <div className="edit-comment-modal" onClick={() => setEditMode(false)}>
          <div className="edit-comment" onClick={(e) => e.stopPropagation()}>
            <Typography variant="h5">Edit comment</Typography>

            <div className="close-button" onClick={() => setEditMode(false)}>
              X
            </div>
            <Divider style={{ backgroundColor: "gray", width: "100%" }} />
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignSelf: "flex-start",
              }}
            >
              {photoPath ? (
                <Avatar alt="avatar" src={photoPath} />
              ) : (
                <Avatar
                  sx={{
                    bgcolor: "#f44336",
                    width: 40,
                    height: 40,
                  }}
                  aria-label="user avatar"
                >
                  {username ? username[0] : null}
                </Avatar>
              )}
              <Typography variant="body">
                {username ? username : null}
              </Typography>
            </Box>
            <TextField
              multiline
              fullWidth
              style={{ border: "0px" }}
              rows={5}
              defaultValue={comment.message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={handleCommentUpdate}>
              Update
            </Button>
          </div>
        </div>
      ) : null}
    </List>
  );
};

export default DisplayComment;
