const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { checkRole } = require('./middleware/courseMiddleware');
const { createCourse } = require('./controllers/courseController');
const Course = require('./models/courses');
const User = require('./models/User');
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

app.post('/courses', requireAuth, checkRole('teacher'), (req, res) => {
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
app.get('/courses/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  Course.findById(id)
  .then(result => {
      res.render('courseDetails', { course: result, title: 'Course Details', user: req.user });
  })
  .catch(err => {
      console.log(err);
  });
 
})

app.delete('/courses/:id', requireAuth, checkRole('teacher'), (req, res) => {
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


// schedule

app.post('/student/:studentID/add-course/:courseID', requireAuth, checkRole('student'), async (req, res) => {
  try {
    const student = await User.findById(req.params.studentID);

    if (!student.schedule) {
      student.schedule = [];
    }

    if (student.schedule.includes(req.param.courseID)) {
      console.error('cannot add course twice');
      res.status(500).send('Cannot add course twice');
    } else {
      student.schedule.push(req.params.courseID);
      await student.save();
      res.status(201).send();
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
app.post('/student/:studentID/remove-course/:courseID', requireAuth, checkRole('student'), async (req, res) => {
  try {
    const student = await User.findById(req.params.studentID);

    if (!student.schedule) {
      res.status(201).send();
    }

    const courseIndex = student.schedule.indexOf(req.params.courseID);

    if (courseIndex >= 0) {
      student.schedule.splice(courseIndex, 1);
      await student.save();
      res.status(201).send();
    } else {
      console.error('cannot remove course that is not in schedule');
      res.status(500).send('cannot remove course that is not in schedule');
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//keeping auth routes separate from routes code
app.use(authRoutes);



// View routes for students
app.get('/studWelcome', (req, res) => {
  res.render('studWelcome');
});

app.get('/studAddCourse', (req, res) => {
  Course.find()
      .then((result) => {
          res.render('studAddCourse', { courses: result });
      })
      .catch((err) => {
          console.log(err);
      })
});

app.get('/studViewSched', requireAuth, checkRole('student'), async (req, res) => {
  const courseIDs = req.user?.schedule || [];

  try {
    const courses = await Course.find({
      '_id': { 
        $in: courseIDs,
      }
    });

    res.render('studViewSched', {
      user: req.user,
      courses,
    });
    
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});


app.get('/create', (req, res) => {
  res.render('create');
})