import "./App.css";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Home from "./components/Home";
import SinglePost from "./components/SinglePost";
import UserProfile from "./components/UserProfile";
import Users from "./components/Users";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/feed" element={<Home />} />
          <Route path="/post/:postId" element={<SinglePost />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
