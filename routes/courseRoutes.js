// routes/courseRoutes.js

const { Router } = require('express');
const courseController = require('../controllers/courseController');
const { requireAuth } = require('../middleware/authMiddleware'); // If needed, you can add authentication middleware for course-related routes
const { checkRole } = require('../middleware/courseMiddleware'); // Ensure the correct path to courseMiddleware.js
const router = Router();

router.post('/createCourse', requireAuth, checkRole, courseController.createCourse);


// Route to create a new course
router.post('/courses', requireAuth, courseController.createCourse);

// Route to get all courses
router.get('/courses', courseController.getAllCourses);

// Route to get a specific course by its ID
router.get('/courses/:id', courseController.getCourseById);

// Route to get courses created by a specific user (teacher)
router.get('/teachWelcome', requireAuth, courseController.getCoursesByUser);

// Add more routes as needed, such as updating and deleting courses

module.exports = router;
