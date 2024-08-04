import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Common/Header';
import LoginPopup from './pages/Auth/LoginPopup';
import RegisterPopup from './pages/Auth/RegisterPopup';
import SettingsPage from './pages/Settings/SettingsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import axios from 'axios';

const App = () => {
  const navigate = useNavigate();
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isRegisterPopupOpen, setRegisterPopupOpen] = useState(false);
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const handleLoginSuccess = () => {
    setLoginPopupOpen(false);
    navigate('/settings');
  };

  const handleRegisterSuccess = () => {
    setRegisterPopupOpen(false);
    navigate('/settings');
  };

  const closePopups = () => {
    setLoginPopupOpen(false);
    setRegisterPopupOpen(false);
  };

  return (
    <div className="App">
      <Header 
        onLoginClick={() => { setLoginPopupOpen(true); setRegisterPopupOpen(false); }} 
        onRegisterClick={() => { setRegisterPopupOpen(true); setLoginPopupOpen(false); }} 
      />
      {isLoginPopupOpen && <LoginPopup onSuccess={handleLoginSuccess} onClose={closePopups} onSwitchToRegister={() => { setRegisterPopupOpen(true); setLoginPopupOpen(false); }} />}
      {isRegisterPopupOpen && <RegisterPopup onSuccess={handleRegisterSuccess} onClose={closePopups} onSwitchToLogin={() => { setLoginPopupOpen(true); setRegisterPopupOpen(false); }} />}
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/user/:login" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
