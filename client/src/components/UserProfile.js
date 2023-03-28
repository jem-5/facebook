import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import DisplayFriends from "./DisplayFriends";

const UserProfile = () => {
  const [user, setUser] = useState("");
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSelf, setIsSelf] = useState(false);
  const id = useParams().userId;

  useEffect(() => {
    if (id === localStorage.getItem("userId")) {
      setIsSelf(true);
    }
  }, [id]);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    axios
      .get(`/api/user/${id}`)
      .then((res) => {
        setUser(res.data.user);
        setUsername(user.username);
        setEmail(user.email);
        setPhotoPath(user.photoPath);
      })
      .catch((err) => console.error(err));
  }, [id, user.email, user.photoPath, user.username]);

  const handleUpdateUser = () => {
    axios
      .put(
        `/api/user/${id}`,
        {
          username,
          email,
          photoPath,
        },
        config
      )
      .then((res) => {
        setShowModal(false);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };
  return (
    <div>
      <Header />
      <Card sx={{ maxWidth: 750, margin: "auto" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="h5" component="div">
            Name: {user ? user.username : null}
          </Typography>

          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            email: {user.email ? user.email : "No email added."}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            profile photo:{" "}
            {user.photoPath ? (
              <img
                src={user.photoPath}
                alt="profile"
                style={{ width: "150px" }}
              />
            ) : (
              "No profile photo added."
            )}
          </Typography>

          {user.friends || user.friendRequests ? (
            <DisplayFriends user={user} />
          ) : null}

          {isSelf ? (
            <Button variant="outlined" onClick={() => setShowModal(true)}>
              Update User
            </Button>
          ) : null}
        </CardContent>
      </Card>
      {showModal ? (
        <div className="user-modal">
          <Box className="user-edit">
            <div className="close-button" onClick={() => setShowModal(false)}>
              X
            </div>
            <Typography variant="h5">Update User</Typography>
            <TextField
              label="Name"
              size="small"
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              defaultValue={user.username}
            />
            <TextField
              label="Email"
              type="email"
              size="small"
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              defaultValue={user.email}
            />
            <TextField
              label="Profile Picture"
              size="small"
              onChange={(e) => setPhotoPath(e.target.value)}
              variant="outlined"
              defaultValue={user.photoPath}
            />
            <Button variant="outlined" onClick={handleUpdateUser}>
              Submit
            </Button>
          </Box>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfile;
