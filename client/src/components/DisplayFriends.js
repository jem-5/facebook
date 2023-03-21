import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import uniqid from "uniqid";
import { Link } from "react-router-dom";
import axios from "axios";

const DisplayFriends = ({ user }) => {
  const [friendNames, setFriendNames] = useState([]);
  const [friendRequestNames, setFriendRequestNames] = useState([]);

  useEffect(() => {
    user.friends.map((personId) => {
      return axios
        .get(`http://localhost:3000/api/user/${personId}`)
        .then((res) => {
          if (!friendNames.some((e) => e.id === personId)) {
            const newElement = {
              id: personId,
              name: res.data.user.username,
            };
            setFriendNames(friendNames.concat(newElement));
          }
        })
        .catch((err) => console.error(err));
    });
  }, [user.friends, friendNames]);

  useEffect(() => {
    user.friendRequests.map(async (personId) => {
      return axios
        .get(`http://localhost:3000/api/user/${personId}`)
        .then((res) => {
          if (![...friendNames].some((e) => e.id === personId)) {
            const newElement = {
              id: personId,
              name: res.data.user.username,
            };
            setFriendRequestNames(friendRequestNames.concat(newElement));
          }
        })
        .catch((err) => console.error(err));
    });
  }, [friendNames, friendRequestNames, user.friendRequests]);

  return (
    <div>
      <Typography>Friend Requests:</Typography>

      {friendRequestNames.map((friendName) => {
        return (
          <Typography
            key={uniqid()}
            component="p"
            // onClick={() => window.location.reload()}
          >
            <Link to={`/user/${friendName.id}`}>{friendName.name}</Link>
          </Typography>
        );
      })}
      <Typography>Friends:</Typography>

      {friendNames.map((friendName) => {
        return (
          <Typography
            key={uniqid()}
            component="p"
            onClick={() => window.location.reload()}
          >
            <Link to={`/user/${friendName.id}`}>{friendName.name}</Link>
          </Typography>
        );
      })}
    </div>
  );
};

export default DisplayFriends;
