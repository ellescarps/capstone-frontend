import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './components/Home';
import ProfilePage from './components/Profile';
import SinglePost from './components/SinglePost';


function App() {

  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/users/:id" element={<ProfilePage />}/>
          <Route path="/posts/:id" element={<SinglePost/>}/>
        </Routes>
      </BrowserRouter>


    </div>
  )
}

export default App
