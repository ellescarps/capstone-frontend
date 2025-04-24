import React from 'react'
import './App.css'
import {BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/Home';
import ProfilePage from './components/Profile';
import SinglePost from './components/SinglePost';
import CalloutPage from "./components/CalloutPage";
import PostPage from "./components/PostPage"
import CategoryPage from './components/CategoryPage';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import StickyNavbar from './components/StickyNavbar';
import Navbar from './components/Navbar';



function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {

  return (
    <div>
   
      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/profile' && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/callouts" element={<CalloutPage />} />
        <Route path="/users/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} /> 
      </Routes>

      <StickyNavbar />
    </div>
  );
}

export default App;