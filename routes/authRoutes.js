const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

// Routes for student and teacher welcome pages
router.get('/studWelcome', (req, res) => {
  res.render('studWelcome'); // Replace 'studWelcome' with the actual name of your EJS file for student welcome page
});

router.get('/teachWelcome', (req, res) => {
  res.render('teachWelcome'); // Replace 'teachWelcome' with the actual name of your EJS file for teacher welcome page
});

module.exports = router;
