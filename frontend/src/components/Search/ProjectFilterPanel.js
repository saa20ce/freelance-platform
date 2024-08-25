import React from 'react';
import InputField from '../Form/InputField';
import './ProjectFilterPanel.css';

const ProjectFilterPanel = () => {
    return (
        <div className="project-filter-panel">
            <h3>Рубрики</h3>
            <ul>
                <li><input type="checkbox" /> Новичок (42)</li>
                <li><input type="checkbox" /> Разработка сайта (18)</li>
                <li><input type="checkbox" /> Исправление ошибок (5)</li>
            </ul>
            <h3>Бюджет</h3>
            <ul>
                <li><input type="checkbox" /> До 1 000 ₽ (3)</li>
                <li><input type="checkbox" /> До 5 000 ₽ (15)</li>
                <li><input type="checkbox" /> До 10 000 ₽ (30)</li>
            </ul>
            <h3>Ключевые слова</h3>
            <InputField
                type="text"
                name="keywords"
                placeholder="Введите ключевые слова"
                onChange={() => {}}
            />
        </div>
    );
};

export default ProjectFilterPanel;
