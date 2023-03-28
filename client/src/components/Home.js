import React, { useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import uniqid from "uniqid";
import Header from "./Header";
import AddPost from "./AddPost";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (localStorage.getItem("userAuth") === "true") {
      axios
        .put("/api/posts", { userId })
        .then((res) => setPosts(res.data.posts))
        .catch((err) => console.error(err));
    } else {
      console.log("noauth");
      axios
        .put("/api/posts")
        .then((res) => setPosts(res.data.posts))
        .catch((err) => console.error(err));
    }
  }, [userId, token]);

  return (
    <div>
      <Header />

      <AddPost />
      {posts
        ? posts.map((item) => {
            return <Post key={uniqid()} post={item} />;
          })
        : ""}
    </div>
  );
};

export default Home;
