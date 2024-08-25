const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const userManagementServiceUrl = process.env.USER_MANAGEMENT_SERVICE_URL;
const projectManagementServiceUrl = process.env.PROJECT_MANAGEMENT_SERVICE_URL;
const searchServiceUrl = process.env.SEARCH_SERVICE_URL;

const getUserProfile = async (req, res) => {
    const { login } = req.body;
    console.log(`Fetching profile for login: ${login}`);

    try {
      const response = await axios.post(`${userManagementServiceUrl}/api/users/profile`, { login });
      console.log('Response from user-management-service:', response.data);
      res.send(response.data);
    } catch (err) {
      console.error(`Error fetching user profile: ${err.message}`);
      res.status(400).send({ error: 'Error fetching user profile' });
    }
};

const register = async (req, res) => {
    const { email, role, password } = req.body;

    try {
        console.log(`Registering user with data: ${JSON.stringify({ email, role, password })}`);
        const response = await axios.post(`${userManagementServiceUrl}/api/register/`, { email, role, password });
        const user = response.data;
        console.log(`Response from user-management-service: ${JSON.stringify(user)}`);

        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).send({ token, user });
    } catch (err) {
        if (err.response && err.response.data.detail === "Email already registered") {
            res.status(400).send({ error: "Email already registered" });
        } else {
            console.error(`Error registering user: ${err.message}`);
            res.status(400).send({ error: err.message });
        }
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Logging in user with email: ${email}`);
        const response = await axios.post(`${userManagementServiceUrl}/api/login`, { email, password });
        const user = response.data;

        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.send({ token, user });
    } catch (err) {
        console.error(`Error logging in user: ${err.message}`);
        res.status(400).send({ error: err.response ? err.response.data.detail : 'Error logging in' });
    }
};

const changePassword = async (req, res) => {
    const userId = req.params.id;
    const { newPassword } = req.body;

    try {
        console.log(`Changing password for user ${userId}`);
        const response = await axios.put(`${userManagementServiceUrl}/api/users/${userId}/change-password`, { newPassword });
        res.send(response.data);
        console.log(`Password changed successfully for user ${userId}.`);
    } catch (err) {
        if (err.response && err.response.data) {
            res.status(err.response.status).send({ error: err.response.data.detail });
        } else {
            console.error(`Error changing password: ${err.message}`);
            res.status(400).send({ error: 'Error changing password' });
        }
    }
};

const updateUserLogin = async (req, res) => {
    const userId = req.params.id;
    const { login } = req.body;

    try {
        console.log(`Updating user ${userId} with login: ${login}`);
        const response = await axios.put(`${userManagementServiceUrl}/api/users/${userId}/update-login`, { login });
        res.send(response.data);
        console.log(`User login ${userId} updated successfully.`);
    } catch (err) {
        if (err.response && err.response.data) {
            res.status(err.response.status).send({ error: err.response.data.detail });
        } else {
            console.error(`Error updating user login: ${err.message}`);
            res.status(400).send({ error: 'Error updating user login' });
        }
    }
};

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: Images Only!');
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  });

  const updateProfileSettings = async (req, res) => {
    const userId = req.params.id;
    const { name, specialty, bio, country, city } = req.body;
    let photoPath = null;

    if (req.file) {
        const filePath = `uploads/${req.file.filename}`;
        const outputPath = `uploads/resized_${req.file.filename}.png`;

        try {
            await sharp(filePath)
                .resize(300, 300)
                .toFile(outputPath);

            fs.unlinkSync(filePath);
            photoPath = outputPath;
        } catch (err) {
            return res.status(500).send({ error: 'Error processing image' });
        }
    }

    try {
        const response = await axios.put(`${userManagementServiceUrl}/api/users/${userId}/profile`, {
            name,
            specialty,
            bio,
            country,
            city,
            photo: photoPath
        });
        res.send(response.data);
    } catch (err) {
        if (err.response && err.response.data) {
            res.status(err.response.status).send({ error: err.response.data.detail });
        } else {
            console.error(`Error updating profile settings: ${err.message}`);
            res.status(400).send({ error: 'Error updating profile settings' });
        }
    }
};

const getProjectById = async (req, res) => {
    const projectId = req.params.id;
    try {
        const response = await axios.get(`${projectManagementServiceUrl}/api/projects/${projectId}`);
        res.status(response.status).send(response.data);
    } catch (err) {
        console.error(`Error fetching project: ${err.message}`);
        const status = err.response?.status || 500;
        const error = err.response?.data?.error || 'Error fetching project';
        res.status(status).send({ error });
    }
};

const createProject = async (req, res) => {
    console.log('Received create project request', req.body);
    const { title, description, category, price, allowHigherPrice } = req.body;
    const userId = req.user.id;
    console.log(`Create Project by user ${req.user.id} with request body: ${req.body}`);
    try {
        const response = await axios.post(`${projectManagementServiceUrl}/api/projects/create`, {
            title,
            description,
            category,
            price,
            allowHigherPrice,
            userId,
        });
        res.status(201).send(response.data);
    } catch (err) {
        console.error(`Error creating project: ${err.message}`);
        res.status(500).send({ error: 'Error creating project' });
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    const projectData = req.body;

    try {
        const response = await axios.put(`${projectManagementServiceUrl}/api/projects/${id}`, projectData);
        res.status(response.status).send(response.data);
    } catch (err) {
        console.error(`Error updating project: ${err.message}`);
        const status = err.response?.status || 500;
        const error = err.response?.data?.error || 'Error updating project';
        res.status(status).send({ error });
    }
};

const getUserProjects = async (req, res) => {
    console.log('Received get user project request', req.body);
    const userId = req.user.id;

    try {
        console.log(`Requesting projects from: ${projectManagementServiceUrl}/api/projects/user/${userId}`);
        const response = await axios.get(`${projectManagementServiceUrl}/api/projects/user/${userId}`);
        res.status(response.status).send(response.data);
    } catch (err) {
        console.error(`Error fetching projects: ${err.message}`);
        const status = err.response?.status || 500;
        const error = err.response?.data?.error || 'Error fetching projects';
        res.status(status).send({ error });
    }
};

const changeProjectStatus = async (req, res) => {
    const { projectId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    console.log(`Changing status of project ${projectId} by user ${userId} to ${status}`);

    try {
        const response = await axios.post(`${projectManagementServiceUrl}/api/projects/${projectId}/status`, {
            userId,
            status
        });
        res.status(response.status).send(response.data);
    } catch (err) {
        console.error(`Error changing project status: ${err.message}`);
        const status = err.response?.status || 500;
        const error = err.response?.data?.error || 'Error changing project status';
        res.status(status).send({ error });
    }
};

const searchProjects = async (req, res) => {
    const { q } = req.query;

    try {
        const response = await axios.get(`${searchServiceUrl}/search`, { params: { q } });
        res.send(response.data);
    } catch (err) {
        console.error(`Error searching projects: ${err.message}`);
        const status = err.response?.status || 500;
        const error = err.response?.data?.error || 'Error searching projects';
        res.status(status).send({ error });
    }
};

module.exports = { 
        getUserProfile, 
        register, 
        login, 
        changePassword, 
        updateUserLogin, 
        updateProfileSettings, 
        createProject, 
        getUserProjects, 
        changeProjectStatus, 
        updateProject, 
        getProjectById,
        searchProjects 
    };
