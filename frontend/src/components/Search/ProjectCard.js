import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
    return (
        <div className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Категория: {project.category}</p>
            <p>Бюджет: {project.price}</p>
            <p>Дата создания: {new Date(project.createdAt).toLocaleDateString()}</p>
            <p>Пользователь: {project.user}</p>
            <p>{project.viewed}</p>
        </div>
    );
};

export default ProjectCard;
