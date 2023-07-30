const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { createCourse } = require('./controllers/courseController');
const Course = require('./models/courses');
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));

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

app.get('/courseList', (req, res) => {
  res.redirect('/courses'); 
});

app.get('/home', (req, res) => {
  // will render and send it back to browser
  res.render('home', { title: 'Home'});
});

//teach routes 
app.get('/courses', (req,res) => {
  Course.find()
      .then((result) => {
          res.render('courseList', {title: 'All Courses', courses: result})
      })
      .catch((err) => {
          console.log(err);
      })
});

app.post('/courses', (req, res) => {
  //use middle ware to pass data
  const course = new Course(req.body);
  
  course.save()
      .then((result) => {
          res.redirect('/courses');
      })
      .catch((err) => {
          console.log(err);
      })
})
//make sure you use : colon //getting id
app.get('/courses/:id', (req, res) => {
  const id = req.params.id;
  Course.findById(id)
  .then(result => {
      res.render('courseDetails', { course: result, title: 'Course Details' });
  })
  .catch(err => {
      console.log(err);
  });
 
})

app.delete('/courses/:id', (req, res) => {
  const id = req.params.id;

  Course.findByIdAndDelete(id)
  .then(result => {
      //send it back to this url 
      res.json({ redirect: '/courses'});
  })
  .catch(err => {
      console.log(err);
  })
})



//keeping auth routes separate from routes code
app.use(authRoutes);



// View routes for students
app.get('/studWelcome', (req, res) => {
  res.render('studWelcome');
});

app.get('/studAddCourse', (req, res) => {
  res.render('studAddCourse');
});

app.get('/studViewSched', (req, res) => {
  res.render('studViewSched');
});


app.get('/create', (req, res) => {
  res.render('create');
})