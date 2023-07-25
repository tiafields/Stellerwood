const { Router } = require('express');
const courseController = require('../controllers/courseController');
const { requireAuth } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/courseMiddleware');
const Course = require('../models/Course');

const router = Router();

// Route to render the student course list page
router.get('/studentCourseList', async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('studentCourseList', { courses });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Error getting courses' });
  }
});

// Route to create a new course
router.post('/course', requireAuth, courseController.createCourse);

// Route to get all courses
router.get('/course', courseController.getAllCourses);

// Route to get a specific course by its ID
router.get('/course/:id', courseController.getCourseById);

// Route to get courses created by a specific user (teacher)
router.get('/teachWelcome', requireAuth, courseController.getCoursesByUser);

// Route to render the course creation page (GET request)
router.get('/createCourse', requireAuth, checkRole, (req, res) => {
  res.render('createCourse'); // Assuming you have a view called 'createCourse' to render the page
});

// Route to render the teacher course list page
router.get('/teacherCourseList', async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('teacherCourseList', { courses });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Error getting courses' });
  }
});

// Add more routes as needed, such as updating and deleting courses

module.exports = router;
