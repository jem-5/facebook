import React, { useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import uniqid from "uniqid";
import Header from "./Header";
const Home = () => {
  const [posts, setPosts] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userAuth") === "true") {
      axios
        .put("http://localhost:3000/api/posts", { userId })
        .then((res) => setPosts(res.data.posts))
        .catch((err) => console.error(err));
    } else {
      console.log("noauth");
      axios
        .put("http://localhost:3000/api/posts")
        .then((res) => setPosts(res.data.posts))
        .catch((err) => console.error(err));
    }
  }, [userId, token]);

  return (
    <div>
      <Header />

      {posts
        ? posts.map((item) => {
            return <Post key={uniqid()} post={item} />;
          })
        : ""}
    </div>
  );
};

export default Home;
