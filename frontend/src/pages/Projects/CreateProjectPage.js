import React, { useState } from 'react';
import Title from '../../components/Common/Title';
import Button from '../../components/Common/Button';
import InputField from '../../components/Form/InputField';
import TextAreaField from '../../components/Form/TextAreaField';
import SelectField from '../../components/Form/SelectField';
import './CreateProjectPage.css';

const CreateProjectPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        allowHigherPrice: true,
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь отправка данных на сервер
        console.log('Form submitted:', formData);
    };

    return (
        <div className="create-project-page">
            <Title>Создание проекта</Title>
            <p className="form-description">
                Разместите свою задачу на бирже. Ваш проект станет видимым для тысяч фрилансеров, и некоторые из них сделают вам предложения...
            </p>
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
                <Button type="submit">Создать проект</Button>
            </form>
        </div>
    );
};

export default CreateProjectPage;
