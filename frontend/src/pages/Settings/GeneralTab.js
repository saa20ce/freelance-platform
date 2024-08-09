import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { updateUser } from '../../redux/authSlice';
import InputField from '../../components/Form/InputField';
import PasswordField from '../../components/Form/PasswordField';
import Button from '../../components/Common/Button';
import Title from '../../components/Common/Title';
import ValidationError from '../../components/Form/ValidationError';
import './GeneralTab.css';

function GeneralTab() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [login, setLogin] = useState(authState.user?.login || '');
  const [email, setEmail] = useState(authState.user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authState.user) {
      setLogin(authState.user.login || '');
      setEmail(authState.user.email || '');
    }
  }, [authState.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'login') setLogin(value);
    if (name === 'email') setEmail(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    setIsChanged(true);
  };

  const handleSave = async () => {
    setError('');
    if (newPassword && newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      if (login) {
        const responseLogin = await axios.put(`http://localhost:3001/api/auth/users/${authState.user.id}/update-login`, {
          login,
        });

        if (responseLogin.data) {
          console.log('Response data:', responseLogin.data);
          dispatch(updateUser({
            ...authState.user,
            email: responseLogin.data.email || email,
            login: responseLogin.data.login || login
          }));
        }
      }

      // Обновление пароля, если введен новый пароль
      if (newPassword) {
        const responsePassword = await axios.put(`http://localhost:3001/api/auth/users/${authState.user.id}/change-password`, {
          newPassword,
        });

        if (responsePassword.data) {
          console.log('Password changed successfully:', responsePassword.data);
        }
      }

      setIsChanged(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating user:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Ошибка при обновлении данных');
      }
    }
  };

  if (!authState.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="general-tab">
      <Title>Общие настройки</Title>
      <form>
        <label>
          Логин:
          <InputField
            type="text"
            name="login"
            value={login}
            onChange={handleInputChange}
            placeholder="Введите логин"
          />
        </label>
        <label>
          Email:
          <InputField
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Введите email"
          />
        </label>
        <label>
          Новый пароль:
          <PasswordField
            name="newPassword"
            value={newPassword}
            onChange={handleInputChange}
            placeholder="Введите новый пароль"
          />
        </label>
        <label>
          Новый пароль (еще раз):
          <PasswordField
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            placeholder="Введите новый пароль еще раз"
          />
        </label>
        {error && <ValidationError message={error} />}
        <Button type="button" onClick={handleSave} disabled={!isChanged} className="success">Сохранить</Button>
      </form>
      <div className="links">
        <a href="#">Привязать номер телефона</a>
        <a href="#" className="delete-account">Удалить аккаунт</a>
      </div>
    </div>
  );
}

export default GeneralTab;
