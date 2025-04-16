const fs = require('fs');
const path = require('path');

// Define the models directory
const modelsDir = path.join(__dirname, 'src', 'models');

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Create courseModel.js
const courseModelContent = `// SQLite Course Model
const db = require('../db');

// This is a placeholder file for the course model
// In a SQLite implementation, we don't need actual model files
// They're replaced by direct database queries

module.exports = {
  // Just a placeholder to satisfy the require statements
};`;

fs.writeFileSync(path.join(modelsDir, 'courseModel.js'), courseModelContent, 'utf8');
console.log('Created courseModel.js');

// Create userModel.js
const userModelContent = `// SQLite User Model
const db = require('../db');

// This is a placeholder file for the user model
// In a SQLite implementation, we don't need actual model files
// They're replaced by direct database queries

module.exports = {
  // Just a placeholder to satisfy the require statements
};`;

fs.writeFileSync(path.join(modelsDir, 'userModel.js'), userModelContent, 'utf8');
console.log('Created userModel.js');

// Create jobModel.js
const jobModelContent = `// SQLite Job Model
const db = require('../db');

// This is a placeholder file for the job model
// In a SQLite implementation, we don't need actual model files
// They're replaced by direct database queries

module.exports = {
  // Just a placeholder to satisfy the require statements
};`;

fs.writeFileSync(path.join(modelsDir, 'jobModel.js'), jobModelContent, 'utf8');
console.log('Created jobModel.js');

console.log('Model files created successfully!'); 