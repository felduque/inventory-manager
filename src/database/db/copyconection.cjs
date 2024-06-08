// db.js
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./src/database/db/inventory.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'Vendedor',
  avatar TEXT DEFAULT 'https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png'
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});


const getUser = (id, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    callback(row);
  });
};

const getAllUsers = (callback) => {
  db.all('SELECT id, name, email FROM users', (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    callback(rows);
  });
}

const updateUser = (id, name, email, password, callback) => {
  db.run('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id], (err) => {
    if (err) {
      console.error(err.message);
    }
    callback();
  });
};

const createUser = (name, email, password, avatar, callback) => {
  db.run('INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?)', [name, email, password, avatar], (err) => {
    if (err) {
      console.error(err.message);
    }
    callback();
  });
}

const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  closeDatabase,
  getAllUsers,
};