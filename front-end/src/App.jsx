import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './components/Home';
import ProfilePage from './components/Profile';
import SinglePost from './components/SinglePost';
import { useState } from 'react';

function App() {
 const [searchParams, setSearchParams] = useState("");


  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage searchParams={searchParams}/>}/>
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/post/:id" element={<SinglePost/>}/>
        </Routes>
      </BrowserRouter>


    </div>
  )
}

export default App
