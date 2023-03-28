import React, { useEffect, useState } from "react";
import ClapIcon from "../assets/clapping.png";
import AngryIcon from "../assets/angry.png";
import CryIcon from "../assets/crying.png";
import HeartIcon from "../assets/heart.png";
import LikeIcon from "../assets/like.png";
import Typography from "@mui/material/Typography";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import uniqid from "uniqid";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";

const DisplayReactions = ({ reactions }) => {
  const [loveReaction, setLoveReaction] = useState(false);
  const [likeReaction, setLikeReaction] = useState(false);
  const [cryReaction, setCryReaction] = useState(false);
  const [clapReaction, setClapReaction] = useState(false);
  const [angryReaction, setAngryReaction] = useState(false);
  const [users, setUsers] = useState([]);
  const [showReactionDetails, setShowReactionDetails] = useState(false);

  useEffect(() => {
    reactions.forEach((element) => {
      axios
        .get(`/api/user/${element.user}`)
        .then((res) => {
          const user = res.data.user.username;
          setUsers((prevState) => new Set([...prevState, user]));
        })
        .catch((err) => console.error(err.data));
    });
  }, [reactions]);

  useEffect(() => {
    if (reactions.some((e) => e.type === "love")) {
      setLoveReaction(true);
    }
    if (reactions.some((e) => e.type === "clap")) {
      setClapReaction(true);
    }
    if (reactions.some((e) => e.type === "cry")) {
      setCryReaction(true);
    }
    if (reactions.some((e) => e.type === "angry")) {
      setAngryReaction(true);
    }
    if (reactions.some((e) => e.type === "like")) {
      setLikeReaction(true);
    }
  }, [reactions]);

  return (
    <div>
      <Typography
        variant="p"
        onClick={() => setShowReactionDetails(!showReactionDetails)}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {loveReaction ? <img width="32px" src={HeartIcon} alt="love" /> : null}
        {likeReaction ? <img width="32px" src={LikeIcon} alt="like" /> : null}
        {cryReaction ? <img width="32px" src={CryIcon} alt="cry" /> : null}
        {clapReaction ? <img width="32px" src={ClapIcon} alt="clap" /> : null}
        {angryReaction ? (
          <img width="32px" src={AngryIcon} alt="angry" />
        ) : null}
        {reactions.length}
      </Typography>
      {users && showReactionDetails ? (
        <Box className="reaction-details">
          <List>
            {[...users].map((user) => {
              return (
                <ListItem key={uniqid()}>
                  <ListItemText>{user}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ) : null}
    </div>
  );
};

export default DisplayReactions;
