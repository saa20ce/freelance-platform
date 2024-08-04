import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser } from '../../redux/authSlice';
import PopupOverlay from '../../components/Popup/PopupOverlay';
import InputField from '../../components/Form/InputField';
import Button from '../../components/Common/Button';
import vkIcon from '../../assets/icons/vk_icon.svg';
import googleIcon from '../../assets/icons/google_icon.svg';
import './RegisterPopup.css';

const RegisterPopup = ({ onSuccess, onClose, onSwitchToLogin }) => {
  const [role, setRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(registerUser({ email, role, password })).unwrap();
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PopupOverlay onClose={onClose}>
      <h2>Регистрация</h2>
      <div className="role-selector">
        <button
          className={`role-button ${role === 'buyer' ? 'active' : ''}`}
          onClick={() => setRole('buyer')}
        >
          Покупатель
        </button>
        <button
          className={`role-button ${role === 'seller' ? 'active' : ''}`}
          onClick={() => setRole('seller')}
        >
          Продавец
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Пароль" 
          required 
        />
        <div className="agreement">
          <input type="checkbox" id="agreement" required />
          <label htmlFor="agreement">
            Я ознакомлен(а), понимаю и принимаю{' '}
            <a href="#">Пользовательское соглашение</a>,{' '}
            <a href="#">Политику конфиденциальности</a> и согласен(а) на
            получение email-рассылок
          </label>
        </div>
        <Button type="submit" className="success">Далее</Button>
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
      <div className="switch-to-login">
        <span>Уже зарегистрированы? </span>
        <a href="#" onClick={onSwitchToLogin}>Войти</a>
      </div>
    </PopupOverlay>
  );
};

RegisterPopup.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
};

export default RegisterPopup;
