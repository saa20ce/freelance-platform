import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../../components/Common/Title';
import Button from '../../components/Common/Button';
import InputField from '../../components/Form/InputField';
import TextAreaField from '../../components/Form/TextAreaField';
import SelectField from '../../components/Form/SelectField';
import './CreateProjectPage.css';

const CreateProjectPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        allowHigherPrice: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (projectId) {
            const fetchProject = async () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3001/api/auth/projects/${projectId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setFormData(response.data);
                } catch (err) {
                    setError('Не удалось загрузить данные проекта');
                } finally {
                    setLoading(false);
                }
            };

            fetchProject();
        }
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (projectId) {
                // Редактирование проекта
                await axios.put(`http://localhost:3001/api/auth/projects/${projectId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Project updated successfully');
            } else {
                // Создание нового проекта
                await axios.post(
                    'http://localhost:3001/api/auth/projects/create',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('Project created successfully');
            }
            navigate('/manage_projects'); // Перенаправление на страницу с проектами
        } catch (error) {
            console.error('Error saving project:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="create-project-page">
            <Title>{projectId ? 'Редактирование проекта' : 'Создание проекта'}</Title>
            <p className="form-description">
                {projectId ? 'Отредактируйте ваш проект.' : 'Разместите свою задачу на бирже.'}
            </p>
            {loading ? (
                <div>Загрузка данных...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <form onSubmit={handleSubmit} className="create-project-form">
                    <label>
                        Название задачи:
                        <InputField
                            type="text"
                            name="title"
                            placeholder="Введите название"
                            maxLength="55"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Детальное описание задачи:
                        <TextAreaField
                            label=""
                            name="description"
                            placeholder="Опишите, что именно вам нужно, в каком объеме и за какой срок"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>
                    <SelectField
                        label="Рубрика"
                        name="category"
                        options={['Выберите рубрику', 'Категория 1', 'Категория 2']}
                        value={formData.category}
                        onChange={handleChange}
                    />
                    <InputField
                        type="text"
                        label="Цена не более"
                        name="price"
                        placeholder="Введите цену"
                        value={formData.price}
                        onChange={handleChange}
                    />
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="allowHigherPrice"
                                checked={formData.allowHigherPrice}
                                onChange={handleCheckboxChange}
                            />
                            Готов рассмотреть предложения с ценой выше, если уровень исполнителя будет выше
                        </label>
                    </div>
                    <Button type="submit">{projectId ? 'Сохранить изменения' : 'Создать проект'}</Button>
                </form>
            )}
        </div>
    );
};

export default CreateProjectPage;
