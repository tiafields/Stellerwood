const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//defines structure of our documents
const courseSchema = new Schema ({

    teachCourseID: {
        type: String, 
        required: true
    },
    teachCourseName: {
        type: String, 
        required: true
    },
    teachCourseDescription: {
        type: String, 
        required: true
    },
    teachCourseSubjectArea: {
        type: String, 
        required: true
    },
    teachCourseCreditHours: {
        type: Number, 
        required: true
    }
    },{timestamps: true}); 


//model surrounds schema and provides with interface to interact with database of that doc type
//define the name which is the singular of your collection, pass in the schema, and store in a constant
const Course = mongoose.model('Course', courseSchema)

module.exports = Course;