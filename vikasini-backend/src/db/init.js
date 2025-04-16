const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Database path
const dbPath = path.join(dbDir, 'vikasini.db');
console.log(`Initializing SQLite database at ${dbPath}`);

// Create and connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      preferred_language TEXT DEFAULT 'english' CHECK(preferred_language IN ('english', 'hindi', 'marathi', 'tamil', 'telugu')),
      profile_image TEXT,
      xp_points INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists');
    }
  });

  // Skills table
  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      level INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating skills table:', err.message);
    } else {
      console.log('Skills table created or already exists');
    }
  });
  
  // Courses table
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      duration INTEGER, /* in minutes */
      difficulty TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating courses table:', err.message);
    } else {
      console.log('Courses table created or already exists');
    }
  });

  // User courses (for tracking progress)
  db.run(`
    CREATE TABLE IF NOT EXISTS user_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      progress REAL DEFAULT 0.0,
      completed BOOLEAN DEFAULT 0,
      last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      UNIQUE(user_id, course_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating user_courses table:', err.message);
    } else {
      console.log('User courses table created or already exists');
    }
  });

  // Jobs table
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      description TEXT,
      type TEXT,
      requirements TEXT,
      posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating jobs table:', err.message);
    } else {
      console.log('Jobs table created or already exists');
    }
  });

  // Job applications
  db.run(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      job_id INTEGER NOT NULL,
      status TEXT DEFAULT 'applied',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
      UNIQUE(user_id, job_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating job_applications table:', err.message);
    } else {
      console.log('Job applications table created or already exists');
    }
  });

  // User interests table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      interest TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating user_interests table:', err.message);
    } else {
      console.log('User interests table created or already exists');
    }
  });

  // Create demo admin user if it doesn't exist
  const adminPassword = bcrypt.hashSync('admin123', 12);
  db.get('SELECT * FROM users WHERE email = ?', ['admin@vikasini.org'], (err, row) => {
    if (err) {
      console.error('Error checking for admin user:', err.message);
    } else if (!row) {
      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@vikasini.org', adminPassword, 'admin'],
        function(err) {
          if (err) {
            console.error('Error creating admin user:', err.message);
          } else {
            console.log('Demo admin user created with email: admin@vikasini.org and password: admin123');
          }
        }
      );
    } else {
      console.log('Admin user already exists');
    }
  });
  
  // Create demo regular user if it doesn't exist
  const userPassword = bcrypt.hashSync('user123', 12);
  db.get('SELECT * FROM users WHERE email = ?', ['user@vikasini.org'], (err, row) => {
    if (err) {
      console.error('Error checking for demo user:', err.message);
    } else if (!row) {
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Priya Sharma', 'user@vikasini.org', userPassword],
        function(err) {
          if (err) {
            console.error('Error creating demo user:', err.message);
          } else {
            const userId = this.lastID;
            console.log('Demo user created with email: user@vikasini.org and password: user123');
            
            // Add some interests for the demo user
            const interests = ['digital_literacy', 'data_entry', 'communication'];
            interests.forEach(interest => {
              db.run('INSERT INTO user_interests (user_id, interest) VALUES (?, ?)', [userId, interest]);
            });
            
            // Add some skills for the demo user
            const skills = [
              { name: 'typing', level: 70 },
              { name: 'excel', level: 50 },
              { name: 'communication', level: 60 }
            ];
            skills.forEach(skill => {
              db.run('INSERT INTO skills (user_id, name, level) VALUES (?, ?, ?)', 
                [userId, skill.name, skill.level]);
            });
          }
        }
      );
    } else {
      console.log('Demo user already exists');
    }
  });
});

// Close the database connection after initialization
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.message);
    } else {
      console.log('Database initialized successfully and connection closed.');
    }
  });
}, 1000); // Small delay to ensure all operations complete 