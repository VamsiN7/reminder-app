// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        {/* <nav>
          <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>
        </nav> */}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
