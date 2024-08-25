import React from 'react';
import Title from '../Common/Title';
import Button from '../Common/Button';
import './SearchHeader.css';

const SearchHeader = () => {
    return (
        <div className="search-header">
            <Title>Биржа проектов</Title>
            {/* <div className="filters">
                <Button to="#">Мои отклики</Button>
                <Button to="#">Проекты</Button>
                <div className="info">
                    <span>Коннекты: Осталось 50 из 50</span>
                    <span>Дата пополнения: 5 сентября</span>
                </div>
            </div>
            <Button className="email-notifications">Настройка email-уведомлений</Button> */}
        </div>
    );
};

export default SearchHeader;
