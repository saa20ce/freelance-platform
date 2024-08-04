import React from 'react';
import PropTypes from 'prop-types';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="tab-navigation">
    <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>Общие</button>
    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Профиль</button>
    <button className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}>Финансы</button>
  </div>
);

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default TabNavigation;
