// controllers/courseController.js

const Course = require('../models/Course');

// Function to create a new course
const createCourse = async (req, res) => {
  const { title, description, instructor } = req.body;

  try {
    const newCourse = await Course.create({ title, description, instructor });
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

module.exports = { createCourse, getAllCourses, getCourseById };
