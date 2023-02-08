import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const UserProfile = () => {
  const [user, setUser] = useState("");

  const id = useParams().userId;

  console.log(user);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error(err));
  }, [id]);

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
          <TextField
            className="edit-user"
            label="Name"
            size="small"
            variant="outlined"
            defaultValue={user.username}
          />
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            email: {user.email ? user.email : "No email added."}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            profile photo:{" "}
            {user.photoPath ? user.photoPath : "No profile photo added."}
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.a
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default UserProfile;
