const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { createCourse } = require('./controllers/courseController');

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
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
app.use(courseRoutes);

// View routes for teachers
app.get('/teacherCreateCourse', (req, res) => {
  res.render('teacherCreateCourse');
});

app.get('/teacherCourseList', (req, res) => {
  res.render('teacherCourseList');
});

// View routes for students
app.get('/studWelcome', (req, res) => {
  res.render('studWelcome');
});

app.get('/studAddCourse', (req, res) => {
  res.render('studAddCourse');
});

