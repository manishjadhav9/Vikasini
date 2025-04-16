const Job = require('../models/jobModel');
const User = require('../models/userModel');

// Get all jobs with filtering
exports.getAllJobs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Basic filtering
    let query = Job.find(queryObj);

    // Text search
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search }
      });
    }

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
    const jobs = await query.populate('postedBy', 'name');

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: {
        jobs
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a single job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name')
      .populate('applications', 'name');

    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found'
      });
    }

    // Get user's preferred language if authenticated
    const preferredLanguage = req.user ? req.user.preferredLanguage || 'english' : 'english';
    
    // Format job content based on user's language
    const formattedJob = {
      ...job.toObject(),
      title: job.title[preferredLanguage] || job.title.english,
      description: job.description[preferredLanguage] || job.description.english,
      requirements: job.requirements[preferredLanguage] || job.requirements.english
    };

    res.status(200).json({
      status: 'success',
      data: {
        job: formattedJob
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get jobs matching user's skills
exports.getMatchingJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's skills and completed courses
    const user = await User.findById(userId)
      .populate('completedCourses', 'category');
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Get user's preferred language
    const preferredLanguage = user.preferredLanguage || 'english';
    
    // Extract user's skills
    const userSkills = user.skills.map(skill => skill.name);
    
    // Extract categories from completed courses
    const courseCategories = user.completedCourses.map(course => course.category);
    
    // All user's skills (from both skills and course categories)
    const allUserSkills = [...new Set([...userSkills, ...courseCategories])];
    
    // Find jobs matching user's skills
    let matchingJobs = await Job.find({
      requiredSkills: { $in: allUserSkills },
      isActive: true
    }).populate('postedBy', 'name');
    
    // Calculate match score for each job
    matchingJobs = matchingJobs.map(job => {
      const jobSkills = job.requiredSkills;
      const matchingSkillsCount = jobSkills.filter(skill => allUserSkills.includes(skill)).length;
      const matchScore = Math.round((matchingSkillsCount / jobSkills.length) * 100);
      
      // Format job based on user's language
      return {
        ...job.toObject(),
        title: job.title[preferredLanguage] || job.title.english,
        description: job.description[preferredLanguage] || job.description.english,
        requirements: job.requirements[preferredLanguage] || job.requirements.english,
        matchScore
      };
    });
    
    // Sort by match score (highest first)
    matchingJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json({
      status: 'success',
      results: matchingJobs.length,
      data: {
        jobs: matchingJobs
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Create a new job
exports.createJob = async (req, res) => {
  try {
    // Add the admin ID as the poster
    req.body.postedBy = req.user.id;
    
    const newJob = await Job.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        job: newJob
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Update a job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Admin: Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found'
      });
    }
    
    // Remove job from all users' applications
    await User.updateMany(
      { jobApplications: req.params.id },
      { $pull: { jobApplications: req.params.id } }
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