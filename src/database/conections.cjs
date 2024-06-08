const PouchDB = require('pouchdb');

const db = new PouchDB('http://felduque:151623@localhost:5984/usuarios');

const getUser = (id, callback) => {
  db.get(id).then((doc) => {
    callback(doc);
  }).catch(err => {
    console.error(err);
  });
}

const updateUser = (name, email, password, avatar, role, callback) => {
  db.get(id).then((doc) => {
    doc.name = name;
    doc.email = email;
    doc.avatar = avatar;
    doc.role = role;
    doc.password = password;
    db.put(doc).then(() => {
      callback();
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(err);
  });
}

const createUser = (name, email, password, avatar, role, callback) => {
  const user = {
    name,
    email,
    password,
    avatar,
    role
  };
  db.post(user).then(() => {
    callback();
  }).catch(err => {
    console.error(err);
  });
}

const getAllUsers = (callback) => {
  db.allDocs({ include_docs: true }).then((result) => {
    const users = result.rows.map((row) => row.doc);
    callback(users);
  }).catch(err => {
    console.error(err);
  });
}

const closeDatabase = () => {
  db.close();
}

module.exports = {
  getUser,
  updateUser,
  createUser,
  closeDatabase,
  getAllUsers,
};