import React from 'react'
import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from './components/Home';
import SinglePost from './components/SinglePost';
import CalloutPage from "./components/CalloutPage";
import PostPage from "./components/PostPage"
import CategoryPage from './components/CategoryPage';
import AuthPage from './components/AuthPage';
import StickyNavbar from './components/StickyNavbar';
import Navbar from './components/Navbar';
import Account from "./components/Account"


function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/users/');

  return (
    <div>
        {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/callouts" element={<CalloutPage />} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} /> 
        <Route path="/account/:id" element={<Account />} />
      </Routes>

      <StickyNavbar />
    </div>
  );
}

export default App;