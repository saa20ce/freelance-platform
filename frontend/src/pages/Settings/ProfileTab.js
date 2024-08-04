import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import InputField from '../../components/Form/InputField';
import TextAreaField from '../../components/Form/TextAreaField';
import Button from '../../components/Common/Button';
import Title from '../../components/Common/Title';
import { updateUser } from '../../redux/authSlice';
import './ProfileTab.css';

function ProfileTab() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (authState.user) {
      setName(authState.user.profile_settings?.name || '');
      setSpecialty(authState.user.profile_settings?.specialty || '');
      setBio(authState.user.profile_settings?.bio || '');
      setCountry(authState.user.profile_settings?.country || '');
      setCity(authState.user.profile_settings?.city || '');
      setPhoto(authState.user.profile_settings?.photo || null);
    }
  }, [authState.user]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'name') setName(value);
    if (name === 'specialty') setSpecialty(value);
    if (name === 'bio') setBio(value);
    if (name === 'country') setCountry(value);
    if (name === 'city') setCity(value);
    if (name === 'photo') setPhoto(files[0]);
    setIsChanged(true);
  };

  const handleSave = async () => {
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('specialty', specialty);
      formData.append('bio', bio);
      formData.append('country', country);
      formData.append('city', city);
      if (photo) {
        formData.append('photo', photo);
      }

      const response = await axios.put(`http://localhost:3001/api/auth/users/${authState.user.id}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        dispatch(updateUser({
          ...authState.user,
          profile_settings: {
            ...authState.user.profile_settings,
            name: response.data.name,
            specialty: response.data.specialty,
            bio: response.data.bio,
            country: response.data.country,
            city: response.data.city,
            photo: response.data.photo
          }
        }));
        setIsChanged(false);
        console.log('Updated user data:', response.data);
      }
    } catch (err) {
      console.error('Error updating user:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Ошибка при обновлении данных');
      }
    }
  };

  return (
    <div className="profile-tab">
      <Title>Настройки профиля</Title>
      <form>
        <label>
          Имя:
          <InputField
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Введите имя"
          />
        </label>
        <label>
          Фото:
          <div className="photo-upload">
            <input type="file" id="photo" name="photo" onChange={handleInputChange} />
            <label htmlFor="photo" className="photo-upload-label">
              <div className="photo-placeholder">
                <span className="plus-icon">+</span>
              </div>
              <span className="upload-text">Выбрать</span>
            </label>
          </div>
        </label>
        <label>
          Вы по специальности:
          <InputField
            type="text"
            name="specialty"
            value={specialty}
            onChange={handleInputChange}
            placeholder="Введите специальность"
          />
        </label>
        <label>
          Информация о вас:
          <TextAreaField
            name="bio"
            value={bio}
            onChange={handleInputChange}
            placeholder="Введите информацию о себе"
          />
        </label>
        <label>
          Страна:
          <InputField
            type="text"
            name="country"
            value={country}
            onChange={handleInputChange}
            placeholder="Введите страну"
          />
        </label>
        <label>
          Город (по желанию):
          <InputField
            type="text"
            name="city"
            value={city}
            onChange={handleInputChange}
            placeholder="Введите город"
          />
        </label>
        {error && <div className="error">{error}</div>}
        <Button type="button" onClick={handleSave} disabled={!isChanged} className="success">Сохранить</Button>
      </form>
      <div className="profile-links">
        <a href="#">Посмотреть профиль</a>
      </div>
    </div>
  );
}

export default ProfileTab;
