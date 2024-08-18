const express = require('express');
const { getUserProfile, register, login, changePassword, updateUserLogin, updateProfileSettings, createProject, getUserProjects } = require('../controllers/authController');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/users/profile', getUserProfile);
router.post('/register', register);
router.post('/login', login);
router.put('/users/:id/change-password', changePassword);
router.put('/users/:id/update-login', updateUserLogin);
router.put('/users/:id/profile', upload.single('photo'), updateProfileSettings);
router.get('/user/projects', authMiddleware, getUserProjects);
router.post('/projects/create', authMiddleware, createProject);

module.exports = router;
