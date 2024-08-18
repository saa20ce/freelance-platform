import React from 'react';
import './ProjectTable.css';

const ProjectTable = ({ projects }) => {
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
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <tr key={project.id}>
                                <td>
                                    <div>{project.title}</div>
                                    <div className="project-date">Создан {new Date(project.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td>{project.price} ₽</td>
                                <td>{project.offers ? project.offers.length : 'Пока нет'}</td>
                                <td>{project.orders ? project.orders.length : 'Пока нет'}</td>
                                <td>
                                    <span className={`status ${project.status.toLowerCase()}`}>{project.status}</span>
                                </td>
                                <td>
                                    <div className="actions">
                                        <button className="play-btn" title="Запустить проект">▶️</button>
                                        <button className="edit-btn" title="Редактировать проект">✏️</button>
                                        <button className="delete-btn" title="Удалить проект">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Проектов нет</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTable;
