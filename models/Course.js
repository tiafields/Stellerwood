// models/Course.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  // Add other attributes as needed
  // For example: price, duration, category, etc.
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
