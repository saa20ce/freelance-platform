import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import Button from '../Common/Button';
import { Link } from 'react-router-dom';
import './Header.css';
import userIcon from '../../assets/icons/Sample_User_Icon.png';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">MyApp</div>
      <nav className="nav">
        <Link to="/kworks" className="nav-link">Кворки</Link>
        <Link to="/orders" className="nav-link">Заказы</Link>
        <Link to="/exchange" className="nav-link">Биржа</Link>
        <Link to="/portfolio" className="nav-link">Портфолио</Link>
        <Link to="/analytics" className="nav-link">Аналитика</Link>
        <Link to="/chat" className="nav-link">Чат</Link>
      </nav>
      <nav className="auth-buttons">
        {isAuthenticated ? (
          <div className="user-profile">
            <img
              src={user?.profilePicture || userIcon}
              alt="User Avatar"
              className="user-avatar"
              onClick={toggleMenu}
            />
            <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
              <div className="dropdown-header">
                <span className="username">{user?.username}</span>
                <div className="roles">
                  <span className="role">Я покупатель</span>
                  <span className="role">Я продавец</span>
                </div>
              </div>
              <div className="dropdown-content">
                <label className="busy-toggle">
                  <span>Занят</span>
                  <input type="checkbox" />
                </label>
                <Link to={`/user/${user.login}`} className="dropdown-link">Профиль</Link>
                <Link to="/settings" className="dropdown-link">Настройки</Link>
                <Link to="/help" className="dropdown-link">Помощь</Link>
                <Button onClick={handleLogout} className="dropdown-link">Выйти</Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Button onClick={onLoginClick} className="primary">Вход</Button>
            <Button onClick={onRegisterClick} className="primary">Регистрация</Button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
