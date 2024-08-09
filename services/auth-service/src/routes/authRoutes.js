const express = require('express');
const { getUserProfile, register, login, changePassword, updateUserLogin, updateProfileSettings } = require('../controllers/authController');
const multer = require('multer');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/users/profile', getUserProfile);
router.post('/register', register);
router.post('/login', login);
router.put('/users/:id/change-password', changePassword);
router.put('/users/:id/update-login', updateUserLogin);
router.put('/users/:id/profile', upload.single('photo'), updateProfileSettings);

module.exports = router;
