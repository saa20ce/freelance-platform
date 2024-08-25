import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../../components/Common/Title';
import Button from '../../components/Common/Button';
import ProjectTable from '../../components/Table/ProjectTable';
import './ManageProjectsPage.css';

const ManageProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/auth/user/projects', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProjects(response.data);
            } catch (err) {
                setError('Не удалось загрузить проекты');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleStatusChange = async (projectId, currentStatus) => {
        const newStatus = currentStatus === 'IN_PROGRESS' ? 'PAUSED' : 'IN_PROGRESS';
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:3001/api/auth/projects/${projectId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === projectId ? { ...project, status: newStatus } : project
                )
            );
        } catch (err) {
            setError('Не удалось изменить статус проекта');
        }
    };

    return (
        <div className="manage-projects-page">
            <div className="header">
                <Title>Мои проекты</Title>
                <Button to="/create_project">Создать задание</Button>
            </div>
            {loading ? (
                <div>Загрузка...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <ProjectTable projects={projects} onStatusChange={handleStatusChange} />
            )}
        </div>
    );
};

export default ManageProjectsPage;
