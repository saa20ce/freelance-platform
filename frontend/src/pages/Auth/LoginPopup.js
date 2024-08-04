import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser } from '../../redux/authSlice';
import PopupOverlay from '../../components/Popup/PopupOverlay';
import InputField from '../../components/Form/InputField';
import PasswordField from '../../components/Form/PasswordField';
import Button from '../../components/Common/Button';
import vkIcon from '../../assets/icons/vk_icon.svg';
import googleIcon from '../../assets/icons/google_icon.svg';
import './LoginPopup.css';

const LoginPopup = ({ onSuccess, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Электронная почта или логин"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="success">Войти</Button>
        {error && <p>{error}</p>}
        <div className="remember-me">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Запомнить меня</label>
          <a href="#" className="forgot-password">Забыли пароль?</a>
        </div>
        <div className="divider">
          <span>или</span>
        </div>
        <div className="social-login">
          <button className="social-button">
            <img src={vkIcon} alt="VK" />
          </button>
          <button className="social-button">
            <img src={googleIcon} alt="Google" />
          </button>
        </div>
      </form>
      <div className="switch-to-register">
        <span>Нет аккаунта? </span>
        <a href="#" onClick={onSwitchToRegister}>Зарегистрироваться</a>
      </div>
    </PopupOverlay>
  );
};

LoginPopup.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginPopup;
