import "../App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import React from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [password2, setPassword2] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState();
  const navigate = useNavigate();

  const handleSignupSubmit = () => {
    axios
      .post("http://localhost:3000/auth/signup", {
        username,
        password,
        password2,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userAuth", true);
        window.location.reload(true);
      })
      .catch((err) => {
        setErrors(err.response.data.error);
        console.log(err.response.data.error);
      });
  };

  const handleLoginSubmit = () => {
    axios
      .post("http://localhost:3000/auth/login", {
        username,
        password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userAuth", true);
        localStorage.setItem("userId", res.data.user._id);

        navigate("/feed");
      })
      .catch((err) => {
        setErrors(err.response.data.error);
        console.log(err.response.data.error);
      });
  };
  console.log(username, password, password2);

  return (
    <div className="landing">
      <div className="title">
        codebook
        <div className="slogan">
          Connect with friends & the world around you on Codebook.
        </div>
      </div>
      <div className="form">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            fullWidth
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        {Array.isArray(errors) ? (
          errors.map((i) => {
            return (
              <Typography variant="p" gutterBottom>
                {i.msg}
              </Typography>
            );
          })
        ) : (
          <Typography variant="p" gutterBottom>
            {errors}
          </Typography>
        )}
        <Button variant="contained" fullWidth onClick={handleLoginSubmit}>
          Log In
        </Button>
        <Divider style={{ backgroundColor: "black", width: "100%" }} />
        <Button
          variant="contained"
          style={{ backgroundColor: "green", width: "70%" }}
          onClick={() => setShowModal(true)}
        >
          Create new account
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: "green", width: "70%" }}
        >
          Guest Log In
        </Button>
      </div>

      {showModal ? (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="sign-up-form" onClick={(e) => e.stopPropagation()}>
            <div className="close-button" onClick={() => setShowModal(false)}>
              X
            </div>
            <Typography variant="h5" gutterBottom>
              Sign up
            </Typography>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1 },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                required
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Box>
            {Array.isArray(errors) ? (
              errors.map((i) => {
                return (
                  <Typography variant="p" gutterBottom>
                    {i.msg}
                  </Typography>
                );
              })
            ) : (
              <Typography variant="p" gutterBottom>
                {errors}
              </Typography>
            )}
            <Button
              variant="contained"
              style={{ backgroundColor: "green" }}
              fullWidth
              onClick={handleSignupSubmit}
            >
              Sign Up
            </Button>
          </div>
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default Landing;
