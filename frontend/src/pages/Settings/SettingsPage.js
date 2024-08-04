import React, { useState } from 'react';
import TabNavigation from './TabNavigation';
import GeneralTab from './GeneralTab';
import ProfileTab from './ProfileTab';
import FinanceTab from './FinanceTab';
import Title from '../../components/Common/Title';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="settings-page">
      <Title>Настройки</Title>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'finance' && <FinanceTab />}
      </div>
    </div>
  );
};

export default SettingsPage;
