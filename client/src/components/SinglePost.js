import React, { useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
const SinglePost = () => {
  const [post, setPost] = useState(null);
  const id = useParams().postId;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/posts/${id}`)
      .then((res) => setPost(res.data.post))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      {" "}
      <Header />
      {post ? <Post post={post} /> : null}
    </div>
  );
};

export default SinglePost;
