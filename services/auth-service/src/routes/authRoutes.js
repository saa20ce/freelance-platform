const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { 
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
    } = require('../controllers/authController');

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
router.get('/projects/:id', authMiddleware, getProjectById);
router.post('/projects/:projectId/status', authMiddleware, changeProjectStatus);
router.put('/projects/:id', authMiddleware, updateProject);
router.get('/projects/search', authMiddleware, searchProjects);


module.exports = router;
