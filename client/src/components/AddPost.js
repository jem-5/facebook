import React, { useState, useEffect, Fragment } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import LanguageIcon from "@mui/icons-material/Language";
import GroupIcon from "@mui/icons-material/Group";

const AddPost = () => {
  const [user, setUser] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [username, setUsername] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [body, setBody] = useState(null);
  const [token, setToken] = useState(null);
  const [visibilityModal, setVisibilityModal] = useState(false);
  const [visibility, setVisibility] = useState("friends");
  const id = localStorage.getItem("userId");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${id}`)
      .then((res) => {
        console.log(res.data);
        setPhotoPath(res.data.user.photoPath);
        setUsername(res.data.user.username);

        setUser(res.data.user);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handlePostSubmit = () => {
    axios
      .post(
        `http://localhost:3000/api/posts`,
        {
          user: user._id,
          body: body,
          visibility: visibility,
        },
        config
      )
      .then((res) => {
        setShowModal(false);
        setVisibilityModal(false);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  console.log();

  return (
    <div>
      <Card
        sx={{
          maxWidth: 570,
          margin: "auto",
          marginBottom: "50px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "auto",
          padding: "15px",
        }}
      >
        {photoPath ? (
          <Avatar alt="avatar" src={photoPath} />
        ) : (
          <Avatar sx={{ bgcolor: "#f44336", width: 30, height: 30 }}>
            {username ? username[0] : null}
          </Avatar>
        )}
        <TextField
          id="outlined-basic"
          label={
            user
              ? `What's on your mind, ${user.username}`
              : "What's on your mind?"
          }
          variant="outlined"
          type="body"
          size="small"
          style={{
            width: "90%",
            backgroundColor: "lightgray",
            borderRadius: "30px",

            border: "none",
          }}
          onClick={() => setShowModal(true)}
        />
      </Card>
      {showModal ? (
        <div onClick={() => setShowModal(false)} className="create-post-modal">
          <div
            className="create-post-form"
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h5">Create post</Typography>

            <div className="close-button" onClick={() => setShowModal(false)}>
              X
            </div>
            <Divider style={{ backgroundColor: "gray", width: "100%" }} />

            <Box
              style={{
                alignSelf: "flex-start",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              {photoPath ? (
                <Avatar alt="avatar" src={user.photoPath} />
              ) : (
                <Avatar sx={{ bgcolor: "#f44336", width: 30, height: 30 }}>
                  {username ? username[0] : null}
                </Avatar>
              )}
              <Box style={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body">
                  {user ? user.username : null}
                </Typography>
                <Typography
                  onClick={() => setVisibilityModal(true)}
                  style={{
                    backgroundColor: "lightgray",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  <LockIcon style={{ width: "18px" }} />
                  {visibility} <ArrowDropDownIcon />
                </Typography>
              </Box>
            </Box>
            <TextField
              multiline
              fullWidth
              style={{ border: "0px" }}
              rows={4}
              onChange={(e) => setBody(e.target.value)}
              label={
                user
                  ? `What's on your mind, ${user.username}`
                  : "What's on your mind?"
              }
            />
            <Button variant="contained" onClick={handlePostSubmit}>
              Post
            </Button>
          </div>
        </div>
      ) : null}
      {visibilityModal ? (
        <div className="visibility-modal">
          <Typography variant="h5" style={{ margin: "0px" }}>
            Post Audience
          </Typography>

          <div
            className="close-button"
            onClick={() => setVisibilityModal(false)}
          >
            X
          </div>
          <Divider style={{ backgroundColor: "gray", width: "100%" }} />

          <Box
            style={{
              alignSelf: "flex-start",
              display: "flex",
              gap: "5px",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              margin: "auto",
              width: "350px",
            }}
          >
            <Typography variant="body">
              Choose who can see your post.
            </Typography>
            <FormControl>
              <FormLabel>Visibility</FormLabel>
              <RadioGroup
                aria-labelledby="post-visibility"
                value={visibility}
                name="radio-buttons-group"
                onChange={(e) => setVisibility(e.target.value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  // alignItems: "center",
                  margin: "auto",
                  width: "350px",
                }}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  // onClick={setVisibility("public")}
                  label={
                    <Fragment>
                      <LanguageIcon style={{ verticalAlign: "middle" }} />
                      Public: Anyone on or off Codebook
                    </Fragment>
                  }
                />
                <FormControlLabel
                  value="friends"
                  control={<Radio />}
                  // onClick={setVisibility("friends")}
                  label={
                    <Fragment>
                      <GroupIcon style={{ verticalAlign: "middle" }} />
                      Friends: Your Friends on Codebook
                    </Fragment>
                  }
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  // onClick={setVisibility("private")}
                  label={
                    <Fragment>
                      <LockIcon style={{ verticalAlign: "middle" }} />
                      Only Me: Private Post
                    </Fragment>
                  }
                />
              </RadioGroup>
            </FormControl>
            <Button
              onClick={() => setVisibilityModal(false)}
              variant="contained"
              style={{ justifySelf: "flex-end", alignSelf: "flex-end" }}
            >
              Done
            </Button>
          </Box>
        </div>
      ) : null}
    </div>
  );
};

export default AddPost;
