const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Get all courses with filtering
exports.getAllCourses = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Filter by category, level, etc.
    let query = Course.find(queryObj).populate('createdBy', 'name');

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Execute query
    const courses = await query;

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('relatedJobs', 'title company jobType');

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all lessons for a course
exports.getCourseLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        lessons: course.lessons
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a specific lesson for a course
exports.getCourseLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    const lesson = course.lessons.id(lessonId);
    
    if (!lesson) {
      return res.status(404).json({
        status: 'fail',
        message: 'Lesson not found'
      });
    }
    
    // Get user's preferred language
    const preferredLanguage = req.user ? req.user.preferredLanguage || 'english' : 'english';
    
    // Format lesson content based on language
    const formattedLesson = {
      _id: lesson._id,
      title: lesson.title[preferredLanguage] || lesson.title.english,
      content: lesson.content[preferredLanguage] || lesson.content.english,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      quizzes: lesson.quizzes.map(quiz => ({
        _id: quiz._id,
        question: quiz.question[preferredLanguage] || quiz.question.english,
        options: quiz.options.map(option => ({
          _id: option._id,
          text: option.text[preferredLanguage] || option.text.english,
          isCorrect: option.isCorrect
        }))
      })),
      xpPoints: lesson.xpPoints
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        lesson: formattedLesson
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Add the admin ID as the creator
    req.body.createdBy = req.user.id;
    
    const newCourse = await Course.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    // Remove course from all users' enrolled and completed courses
    await User.updateMany(
      { $or: [{ completedCourses: req.params.id }, { 'inProgressCourses.courseId': req.params.id }] },
      { 
        $pull: { 
          completedCourses: req.params.id,
          inProgressCourses: { courseId: req.params.id }
        }
      }
    );
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Add a lesson to a course
exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    course.lessons.push(req.body);
    await course.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        lesson: course.lessons[course.lessons.length - 1]
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Update a lesson
exports.updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'Lesson not found'
      });
    }
    
    // Update lesson properties
    Object.keys(req.body).forEach(key => {
      course.lessons[lessonIndex][key] = req.body[key];
    });
    
    await course.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        lesson: course.lessons[lessonIndex]
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'Lesson not found'
      });
    }
    
    course.lessons.splice(lessonIndex, 1);
    await course.save();
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}; 