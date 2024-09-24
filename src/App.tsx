import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './asset/Navbar';
import ListPost from './components/ListPost';
import ViewPostDetail from './components/ViewPostDetail';
import Album from './components/Album';
import ViewAlbumDetail from './components/ViewAlbumDetail';
import ListUser from './components/ListUser';
import ViewUserDetail from './components/ViewUserDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<ListPost />} />
          <Route path="/post" element={<ListPost />} />
          <Route path="/album" element={<Album />} />
          <Route path="/user" element={<ListUser />} />
          <Route path="/viewpostdetail/:id" element={<ViewPostDetail />} />
          <Route path="/viewuserdetail/:id" element={<ViewUserDetail />} />
          <Route path="/viewalbumdetail/:id" element={<ViewAlbumDetail />} />
        </Routes>
      </div>

    </Router>

  );
}

export default App;
