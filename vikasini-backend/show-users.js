const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create an output stream
const outputFile = path.join(__dirname, 'users-report.txt');
const output = fs.createWriteStream(outputFile);

// Helper function to write to file and console
function log(message) {
  console.log(message);
  output.write(message + '\n');
}

// Database path
const dbPath = path.join(__dirname, 'data/vikasini.db');
log(`Connecting to database at: ${dbPath}`);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  log('Connected to the SQLite database.');
});

// Simple function to display users
function displayUsers() {
  return new Promise((resolve, reject) => {
    // Query users
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        console.error('Error querying users:', err.message);
        reject(err);
        return;
      }
      
      log('\n--- Registered Users ---');
      rows.forEach((row) => {
        // Don't display the password hash
        const { password, ...userWithoutPassword } = row;
        log(JSON.stringify(userWithoutPassword, null, 2));
        log('-------------------');
      });

      log(`Total users: ${rows.length}`);
      resolve(rows);
    });
  });
}

// Simple function to display interests
function displayInterests() {
  return new Promise((resolve, reject) => {
    db.all('SELECT user_id, interest FROM user_interests', [], (err, interests) => {
      if (err) {
        console.error('Error querying interests:', err.message);
        reject(err);
        return;
      }
      
      log('\n--- User Interests ---');
      const interestsByUser = interests.reduce((acc, item) => {
        if (!acc[item.user_id]) acc[item.user_id] = [];
        acc[item.user_id].push(item.interest);
        return acc;
      }, {});
      
      Object.entries(interestsByUser).forEach(([userId, interests]) => {
        log(`User ID ${userId}: ${interests.join(', ')}`);
      });
      
      resolve(interests);
    });
  });
}

// Simple function to display skills
function displaySkills() {
  return new Promise((resolve, reject) => {
    db.all('SELECT user_id, name, level FROM skills', [], (err, skills) => {
      if (err) {
        console.error('Error querying skills:', err.message);
        reject(err);
        return;
      }
      
      log('\n--- User Skills ---');
      const skillsByUser = skills.reduce((acc, item) => {
        if (!acc[item.user_id]) acc[item.user_id] = [];
        acc[item.user_id].push(`${item.name} (level: ${item.level})`);
        return acc;
      }, {});
      
      Object.entries(skillsByUser).forEach(([userId, skills]) => {
        log(`User ID ${userId}: ${skills.join(', ')}`);
      });
      
      resolve(skills);
    });
  });
}

// Run all queries
async function main() {
  try {
    await displayUsers();
    await displayInterests();
    await displaySkills();
    
    log('\nDatabase query complete.');
    
    // Close file and database
    output.end();
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
        console.log(`Report saved to: ${outputFile}`);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    output.end();
    db.close();
  }
}

main(); 