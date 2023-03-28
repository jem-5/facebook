import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Button from "@mui/material/Button";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import uniqid from "uniqid";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [self, setSelf] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const self = users.filter((i) => i._id === userId);
    setSelf(self);
  }, [users, userId]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };
  const makeFriendRequest = (id) => {
    axios
      .post(`/api/user/${id}/requests`, { userId }, config)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => console.error(err.data));
  };

  const acceptFriendRequest = (friendId) => {
    axios
      .put(`/api/user/${userId}/requests/${friendId}`, { friendId }, config)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => console.error(err.data));
  };

  const rejectFriendRequest = (friendId) => {
    axios
      .delete(`/api/user/${userId}/requests/${friendId}`, config)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => console.error(err.data));
  };

  const displayUsers = () => {
    return users.map((user) => {
      return (
        <div className="users-list" key={uniqid()}>
          <Typography variant="body" className="user">
            <Link to={`/user/${user._id}`} style={{ textDecoration: "none" }}>
              {user.username}
            </Link>
          </Typography>

          <Typography className="user-status" component={"div"}>
            {user._id === userId ? (
              <Button>
                <PersonIcon /> self
              </Button>
            ) : self.some((arr) => arr.friendRequests.includes(user._id)) ? (
              <div>
                <Button
                  variant="outlined"
                  style={{ color: "green" }}
                  onClick={() => acceptFriendRequest(user._id)}
                >
                  <CheckCircleIcon /> accept{" "}
                </Button>
                <Button
                  variant="outlined"
                  style={{ color: "red" }}
                  onClick={() => rejectFriendRequest(user._id)}
                >
                  <CancelIcon /> reject
                </Button>
              </div>
            ) : user.friends.includes(userId) ? (
              <Button>
                <PeopleOutlineIcon /> friends
              </Button>
            ) : // ) : user.friendRequests.includes(user._id) ? (
            //     <Button>
            //       <PersonAddIcon /> accept
            //     </Button>

            user.friendRequests.includes(userId) ? (
              <Button>
                <PendingIcon /> pending
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => makeFriendRequest(user._id)}
              >
                <PersonAddAlt1Icon /> Add Friend
              </Button>
            )}
          </Typography>
        </div>
      );
    });
  };

  return (
    <div>
      <Header />
      <Typography variant="h4" style={{ textAlign: "center" }}>
        Find Friends
      </Typography>
      <div>{displayUsers()}</div>
    </div>
  );
};

export default Users;
