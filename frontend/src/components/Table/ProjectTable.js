import React from 'react';
import './ProjectTable.css'; // Создайте файл стилей для таблицы

const ProjectTable = () => {
    return (
        <div className="project-table">
            <table>
                <thead>
                    <tr>
                        <th>Проект</th>
                        <th>Цена</th>
                        <th>Предложения</th>
                        <th>Заказы</th>
                        <th>Статус</th>
                        <th>Управлять</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div>Test</div>
                            <div className="project-date">Создан 22 июля</div>
                        </td>
                        <td>500 ₽</td>
                        <td>Пока нет</td>
                        <td>Пока нет</td>
                        <td>
                            <span className="status paused">На паузе</span>
                        </td>
                        <td>
                            <div className="actions">
                                <button className="play-btn" title="Запустить проект">▶️</button>
                                <button className="edit-btn" title="Редактировать проект">✏️</button>
                                <button className="delete-btn" title="Удалить проект">🗑️</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTable;
