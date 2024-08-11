import React from 'react';
import Title from '../../components/Common/Title';
import Button from '../../components/Common/Button';
import ProjectTable from '../../components/Table/ProjectTable';
import './ManageProjectsPage.css';

const ManageProjectsPage = () => {
    return (
        <div className="manage-projects-page">
            <div className="header">
                <Title>Мои проекты</Title>
                <Button to="/create_project">Создать задание</Button>
            </div>
            <ProjectTable />
        </div>
    );
};

export default ManageProjectsPage;
