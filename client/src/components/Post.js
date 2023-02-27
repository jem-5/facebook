import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import IosShareIcon from "@mui/icons-material/IosShare";
import Divider from "@mui/material/Divider";
import DisplayReactions from "./DisplayReactions";
import ClapIcon from "../assets/clapping.png";
import AngryIcon from "../assets/angry.png";
import CryIcon from "../assets/crying.png";
import HeartIcon from "../assets/heart.png";
import LikeIcon from "../assets/like.png";
import Box from "@mui/material/Box";
import DisplayComment from "./DisplayComment";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { Link, useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/DeleteForever";

const Post = ({ post }) => {
  const [user, setUser] = useState(null);
  const [reactions, setReactions] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [token, setToken] = useState(null);
  const [shareMessage, setShareMessage] = useState(false);
  const reactionsRef = useRef();
  const [commentForm, setCommentForm] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(null);
  const commentInput = useRef();
  const [editMode, setEditMode] = useState(false);
  const [body, setBody] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handlePostUpdate = () => {
    axios
      .put(
        `http://localhost:3000/api/posts/${post._id}`,
        {
          body: body,
          user: localStorage.getItem("userId"),
        },
        config
      )
      .then((res) => window.location.reload())
      .catch((err) => console.error(err));
  };

  const handlePostDelete = () => {
    axios
      .delete(
        `http://localhost:3000/api/posts/${post._id}`,

        config
      )
      .then((res) => window.location.reload())
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${post.user}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error(err));
  }, []);

  const handleCommentSubmit = () => {
    axios
      .post(
        `http://localhost:3000/api/posts/${post._id}/comments`,
        {
          post: post._id,
          user: localStorage.getItem("userId"),
          message: comment,
        },
        config
      )
      .then((res) => {
        console.log(res.data);
        setComment("");
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/posts/${post._id}/reactions`)
      .then((res) => setReactions(res.data.reactions))
      .catch((err) => console.error(err));
  }, [post]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/posts/${post._id}/comments`)
      .then((res) => setComments(res.data.comments))
      .catch((err) => console.error(err));
  }, [post]);

  const handleNewReaction = (reactString) => {
    console.log(reactString);
    axios
      .post(
        `http://localhost:3000/api/posts/${post._id}/reactions`,
        {
          postId: post._id,
          userId: localStorage.getItem("userId"),
          type: reactString,
        },
        config
      )
      .then((res) => window.location.reload())
      .catch((err) => console.error(err));
  };

  const sharePost = () => {
    setShareMessage(true);
    const url = window.location.host + `/posts/${post._id}`;
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      setShareMessage(false);
    }, 3000);
  };

  useEffect(() => {
    const click = (event) => {
      if (event.target === reactionsRef.current) {
        setShowReactions(true);
      } else {
        setShowReactions(false);
      }
    };
    window.addEventListener("click", click);
  }, []);

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
    <div>
      {user ? (
        <Card sx={{ maxWidth: 600, margin: "auto", marginBottom: "20px" }}>
          <CardHeader
            avatar={
              user.photoPath ? (
                <Avatar alt="avatar" src={user.photoPath} />
              ) : (
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {user.username[0]}
                </Avatar>
              )
            }
            action={
              <div>
                <IconButton
                  onClick={() => setEditMode(true)}
                  aria-label="settings"
                >
                  {user._id === localStorage.getItem("userId") ? (
                    <EditIcon />
                  ) : null}
                </IconButton>
                <IconButton
                  onClick={() => setDeleteMode(true)}
                  aria-label="settings"
                  style={{ position: "relative" }}
                >
                  {user._id === localStorage.getItem("userId") ? (
                    <DeleteIcon />
                  ) : null}
                </IconButton>
              </div>
            }
            title={
              <Link
                to={`/user/${user._id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                {user.username}{" "}
              </Link>
            }
            subheader={
              <Link
                to={`/post/${post._id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                {getTime(post.createdAt)}
              </Link>
            }
          />

          {post.photoPath ? (
            <CardMedia
              component="img"
              height="194"
              image={post.photoPath}
              alt="Coding"
            />
          ) : (
            ""
          )}
          {deleteMode ? (
            <div style={{ position: "relative" }}>
              <div className="delete-confirmation">
                <Typography variant="h6">
                  Are you sure you'd like to delete this post?
                </Typography>
                <Button variant="contained" onClick={handlePostDelete}>
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
          <CardContent>
            <Typography paragraph>{post.body}</Typography>
          </CardContent>
          <Divider style={{ backgroundColor: "gray", width: "100%" }} />

          {reactions ? (
            <CardActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <DisplayReactions reactions={reactions} />
              <Typography variant="p">
                {post.shares ? post.shares : 0} shares
              </Typography>
            </CardActions>
          ) : (
            " "
          )}
          <Divider style={{ backgroundColor: "gray", width: "100%" }} />

          <CardActions
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <IconButton
              aria-label="Like"
              onClick={() => setShowReactions(true)}
            >
              <ThumbUpOffAltIcon />
              <Typography ref={reactionsRef}>Like</Typography>
            </IconButton>
            {showReactions ? (
              <Box className="create-reaction">
                <img
                  className="reaction-emoji"
                  onClick={() => handleNewReaction("like")}
                  src={LikeIcon}
                  alt="like"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => handleNewReaction("love")}
                  src={HeartIcon}
                  alt="love"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => handleNewReaction("clap")}
                  src={ClapIcon}
                  alt="clap"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => handleNewReaction("cry")}
                  src={CryIcon}
                  alt="cry"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => handleNewReaction("angry")}
                  src={AngryIcon}
                  alt="angry"
                />
              </Box>
            ) : null}
            <IconButton
              aria-label="Comment"
              onClick={() => setCommentForm(!commentForm)}
            >
              <ChatBubbleOutlineIcon />
              <Typography>Comment</Typography>
            </IconButton>
            <IconButton aria-label="Share" onClick={() => sharePost()}>
              <IosShareIcon />
              <Typography>Share </Typography>
              {shareMessage ? (
                <Typography className="share-message">
                  Post link copied to clipboard.
                </Typography>
              ) : null}
            </IconButton>
          </CardActions>
          {commentForm ? (
            <div>
              <Paper
                component="form"
                id="comment"
                label="Write a comment..."
                variant="filled"
                fullwidth="true"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "lightgray",
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="menu">
                  {user.photoPath ? (
                    <Avatar
                      sx={{ width: 24, height: 24 }}
                      alt="avatar"
                      src={user.photoPath}
                    />
                  ) : (
                    <Avatar sx={{ bgcolor: "#f44336", width: 24, height: 24 }}>
                      {user.username[0]}
                    </Avatar>
                  )}
                </IconButton>
                <InputBase
                  defaultValue={comment}
                  ref={commentInput}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Write a comment..."
                  inputProps={{ "aria-label": "write a comment..." }}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                  onClick={handleCommentSubmit}
                >
                  <SubdirectoryArrowLeftIcon />
                </IconButton>
              </Paper>
            </div>
          ) : null}
          {comments
            ? comments.map((comment) => {
                return <DisplayComment key={uniqid()} comment={comment} />;
              })
            : null}
        </Card>
      ) : (
        " "
      )}
      {editMode ? (
        <div className="edit-post-modal" onClick={() => setEditMode(false)}>
          <div className="edit-post" onClick={(e) => e.stopPropagation()}>
            <Typography variant="h5">Edit post</Typography>

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
              {user.photoPath ? (
                <Avatar alt="avatar" src={user.photoPath} />
              ) : (
                <Avatar
                  sx={{
                    bgcolor: "#f44336",
                    width: 40,
                    height: 40,
                  }}
                  aria-label="user avatar"
                >
                  {user ? user.username[0] : null}
                </Avatar>
              )}
              <Typography variant="body">
                {user ? user.username : null}
              </Typography>
            </Box>
            <TextField
              multiline
              fullWidth
              style={{ border: "0px" }}
              rows={5}
              defaultValue={post.body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Button variant="contained" onClick={handlePostUpdate}>
              Update
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Post;
