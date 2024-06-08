const PouchDB = require('pouchdb');

const db = new PouchDB('http://felduque:151623@localhost:5984/provedores');
PouchDB.plugin(require('pouchdb-find'));

const getAllSuppliers = (callback) => {
  db.allDocs({ include_docs: true }).then((result) => {
    const suppliers = result.rows.map((row) => row.doc);
    callback(suppliers);
  }).catch(err => {
    console.error(err);
  });
}

const createSupplier = (supplier, callback) => {
  db.post(supplier).then(() => {
    callback();
  }
  ).catch(err => {
    console.error(err);
  });
}

module.exports = {
  getAllSuppliers,
  createSupplier,
}