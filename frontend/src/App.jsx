import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './Register';
import SignIn from './SignIn';
import MainPage from './MainPage';
import ProfilePage from './ProfilePage';
import ItemsPage from './ItemsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/items" element={<ItemsPage />} />

    </Routes>
  );
}

export default App;