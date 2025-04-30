import React, { useState } from 'react'
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
import UserProfile from './components/UserProfile';
import CreatePost from './components/CreatePost';
import Inbox from './components/Inbox';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from './components/SearchPage';


function App() {
  const [search, setSearch] = useState("");  // Lifting state up
  const location = useLocation();

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/search' ||
    location.pathname === '/inbox' ||
    location.pathname.startsWith('/users/');

  return (
    <div>
        {!hideNavbar && <Navbar setSearch={setSearch} search={search}/>}

      <Routes>
        <Route path="/" element={<HomePage search={search} />} />
        <Route path="/posts" element={<PostPage search={search} />} />
        <Route path="/callouts" element={<CalloutPage search={search} />} />
        <Route path="/posts/:id" element={<SinglePost search={search} />} />
        <Route path="/categories/:categoryName" element={<CategoryPage search={search} />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} /> 
        <Route path="/account/:id" element={<Account />} />
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/postcall" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />   
        <Route path="/search" element={<SearchPage />} /> 
      </Routes>

      <StickyNavbar />
    </div>
  );
}

export default App;