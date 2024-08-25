import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import './ProjectTable.css';

const ProjectTable = ({ projects, onStatusChange }) => {
    const navigate = useNavigate();

    const handleEditClick = (projectId) => {
        navigate(`/edit_project/${projectId}`);
    };

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
                                        <Button 
                                            className="play-btn"
                                            onClick={() => onStatusChange(project.id, project.status)}
                                            title={project.status === 'IN_PROGRESS' ? 'Приостановить проект' : 'Запустить проект'}
                                        >
                                            {project.status === 'IN_PROGRESS' ? '⏸️' : '▶️'}
                                        </Button>
                                        <Button 
                                            className="edit-btn"
                                            title="Редактировать проект"
                                            onClick={() => handleEditClick(project.id)}
                                        >
                                            ✏️
                                        </Button>
                                        <Button className="delete-btn" title="Удалить проект">🗑️</Button>
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
