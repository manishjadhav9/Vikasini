const fs = require('fs');
const path = require('path');

const content = `// Basic user controller file
module.exports = {
  getMe: (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  },
  
  updateMe: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  getMyCourses: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  enrollCourse: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  updateCourseProgress: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  getMyApplications: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  applyForJob: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  getAllUsers: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  getUser: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  
  deleteUser: (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  }
};`;

const filePath = path.join(__dirname, 'src', 'controllers', 'userController.js');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`File created at: ${filePath}`); 