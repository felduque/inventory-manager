const PouchDB = require('pouchdb');

const db = new PouchDB('http://felduque:151623@localhost:5984/clientes');
PouchDB.plugin(require('pouchdb-find'));

const getAllClientes = (callback) => {
  db.allDocs({ include_docs: true }).then((result) => {
    const clientes = result.rows.map((row) => row.doc);
    callback(clientes);
  }).catch(err => {
    console.error(err);
  });
}

const createCliente = (cliente, callback) => {
  db.post(cliente).then((response) => {
    callback(response);
  }
  ).catch(err => {
    console.error(err);
  });
}

const updateCliente = (cliente, callback) => {
  db.put(cliente).then((response) => {
    callback(response);
  }
  ).catch(err => {
    console.error(err);
  });
}

module.exports = {
  getAllClientes,
  createCliente,
  updateCliente,
}