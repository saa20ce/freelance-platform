import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';
import userIcon from '../../assets/icons/Sample_User_Icon.png';
import defaultBackground from '../../assets/images/default_background.jpg';

const ProfilePage = () => {
  const { login } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(`Fetching profile for login: ${login}`);
        const response = await axios.post(`http://localhost:3001/api/auth/users/profile`, { login });
        console.log('Response data:', response.data);
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Ошибка при загрузке профиля', err);
      }
    };

    fetchProfile();
  }, [login]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Загрузка...</div>;
  }

  const { profile_settings: profileSettings, general_settings: generalSettings } = profile;
  const registrationDate = profileSettings?.registrationDate
    ? new Date(profileSettings.registrationDate).toLocaleDateString()
    : 'Неизвестно';

    return (
      <div className="profile-page">
        <div className="profile-header">
          <img src={profileSettings?.backgroundImage || defaultBackground} alt="Background" className="profile-background" />
          <div className="profile-info">
            <img src={profileSettings?.photo || userIcon} alt="User" className="profile-photo" />
            <div className="profile-details">
              <h2>{profileSettings?.name || 'Без имени'}</h2>
              <p>{profileSettings?.specialty || 'Без специальности'}</p>
              <p>{profileSettings?.bio || 'Без описания'}</p>
              <p>На сайте с {registrationDate}</p>
              <p>{profileSettings?.status || 'Без статуса'}</p>
            </div>
            <Link to="/settings" className="profile-edit-button">
              Настройки профиля
            </Link>
          </div>
        </div>
      </div>
    );
  };

export default ProfilePage;
