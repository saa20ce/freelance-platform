const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const userManagementServiceUrl = process.env.USER_MANAGEMENT_SERVICE_URL;

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

const updateGeneralSettings = async (req, res) => {
    const userId = req.params.id;
    const { email, login, password } = req.body;

    try {
        console.log(`Updating user ${userId} with login: ${login}, password: ${password}, email: ${email}`);
        const response = await axios.put(`${userManagementServiceUrl}/api/users/${userId}/general`, { email, login, password });
        res.send(response.data);
        console.log(`User ${userId} updated successfully.`);
    } catch (err) {
        if (err.response && err.response.data) {
            res.status(err.response.status).send({ error: err.response.data.detail });
        } else {
            console.error(`Error updating general settings: ${err.message}`);
            res.status(400).send({ error: 'Error updating general settings' });
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

module.exports = { getUserProfile, register, login, changePassword, updateGeneralSettings, updateProfileSettings };
