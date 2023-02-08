import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (post.user) {
      axios
        .get(`http://localhost:3000/api/user/${post.user}`)
        .then((res) => setUser(res.data.user))
        .catch((err) => console.error(err));
    }
  }, [post]);

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

  const handleNewReaction = () => {
    axios
      .post(
        `http://localhost:3000/api/posts/${post._id}/reactions`,
        {
          postId: post._id,
          userId: localStorage.getItem("userId"),
          type: reaction,
        },
        config
      )
      .then((res) => console.log(res.data))
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

  return (
    <div>
      {user ? (
        <Card sx={{ maxWidth: 600, margin: "auto" }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {user.username[0]}
              </Avatar>
            }
            action={
              <IconButton
                aria-label="settings"
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                <MoreVertIcon />
              </IconButton>
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
                {Math.floor((new Date() - new Date(post.createdAt)) / 86400000)}
                d
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
              <Box className="create-reaction" onClick={handleNewReaction()}>
                <img
                  className="reaction-emoji"
                  onClick={() => setReaction("like")}
                  src={LikeIcon}
                  alt="like"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => setReaction("love")}
                  src={HeartIcon}
                  alt="love"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => setReaction("clap")}
                  src={ClapIcon}
                  alt="clap"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => setReaction("cry")}
                  src={CryIcon}
                  alt="cry"
                />
                <img
                  className="reaction-emoji"
                  onClick={() => setReaction("angry")}
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
                fullWidth
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "lightgray",
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="menu">
                  <Avatar
                    aria-label="avatar"
                    sx={{ width: 24, height: 24, bgcolor: red[500] }}
                  >
                    {user.username[0]}
                  </Avatar>{" "}
                </IconButton>
                <InputBase
                  value={comment}
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
    </div>
  );
};

export default Post;
