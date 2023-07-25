const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const Course = require('./models/Course'); // Add this line to import the Course model

const app = express();
const port = 8080;  // Change the port here

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true })); // Body-parser middleware to parse request bodies

// View engine
app.set('view engine', 'ejs');

// Database connection
const dbURI = 'mongodb+srv://Netninja:testingtesting7854@cluster0.citgyln.mongodb.net/Course-data';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
// Routes
app.get('*', checkUser);

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

// Route to render the teacher create course page (GET request)
app.get('/teacherCreateCourse', requireAuth, (req, res) => {
  if (req.user.role !== 'teacher') {
    // Assuming you have a view called 'notAuthorized' to render the page when a non-teacher user tries to access it
    return res.render('notAuthorized', { message: "You are not authorized to access this page." });
  }
  res.render('teacherCreateCourse'); // Assuming you have a view called 'teacherCreateCourse' to render the page
});

// POST route to handle the form submission for creating a new course
app.post('/teacherCreateCourse', requireAuth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    // Assuming you have a view called 'notAuthorized' to render the page when a non-teacher user tries to access it
    return res.render('notAuthorized', { message: "You are not authorized to access this page." });
  }

  const { instructor, title, description, subjectArea, numOfCreditHours } = req.body;

  try {
    // Create a new course based on the form data
    const newCourse = await Course.create({
      instructor,
      title,
      description,
      subjectArea,
      numOfCreditHours
      // Add other course properties here if needed
    });

    // Course created successfully, redirect to a success page or teacher's course list
    res.redirect('/teacherCourseList'); // Assuming you have a route to show the teacher's course list
  } catch (error) {
    // Handle errors if course creation was not successful
    console.error('Error creating course:', error);
    res.status(500).send('Error creating course'); // You can handle the error in an appropriate way
  }
});

// Route to render the studAddCourse page
app.get('/studAddCourse', requireAuth, async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch the list of courses from the database
    res.render('studAddCourse', { courses }); // Pass the courses data to the template
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Error getting courses' });
  }
});

// Add more routes as needed

// ...

