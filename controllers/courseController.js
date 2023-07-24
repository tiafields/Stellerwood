const Course = require('../models/Course');

// Function to create a new course
const createCourse = async (req, res) => {
    const { createCourseID, createCourseName, createCourseDescription, createSubjectArea, createNumOfCreditHours } = req.body;

  try {
    const newCourse = await Course.create({ createCourseID, createCourseName, createCourseDescription, createSubjectArea, createNumOfCreditHours});
    res.status(201).json({ course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Error creating course' });
  }
};

// Function to get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Error getting courses' });
  }
};

// Function to get a specific course by its ID
const getCourseById = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error('Error getting course by ID:', error);
    res.status(500).json({ error: 'Error getting course by ID' });
  }
};

// Function to get courses by user
const getCoursesByUser = async (req, res) => {
  try {
    // Get the ID of the logged-in user from the auth middleware
    const userId = req.user._id;

    // Find all courses created by the user
    const courses = await Course.find({ instructor: userId });

    // Render the teachWelcome page and pass the courses data
    res.render('teachWelcome', { courses });
  } catch (error) {
    console.error('Error getting courses by user:', error);
    res.status(500).json({ error: 'Error getting courses by user' });
  }
};
// Function to render the course creation page
const renderCreateCoursePage = (req, res) => {
    res.render('createCourse'); // Assuming you have an EJS file named createCourse.ejs in the views directory
  };

module.exports = { createCourse, getAllCourses, getCourseById, getCoursesByUser };
