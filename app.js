const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { createCourse } = require('./controllers/courseController');

const Course = require('./models/Course'); // Add this line to import the Course model

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Netninja:testingtesting7854@cluster0.citgyln.mongodb.net/Course-data';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(4000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
app.use(courseRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Route to render the studentViewSchedule page
app.get('/studViewSched', async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch the list of courses from the database
    res.render('studViewSched', { courses }); // Pass the courses data to the template
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Error getting courses' });
  }
});

// Route to render the studAddCourse page
app.get('/studAddCourse', (req, res) => {
  res.render('studAddCourse'); // Assuming you have a view called 'studAddCourse' to render the page
});

// Add more routes as needed

// ...

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
