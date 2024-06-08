const PouchDB = require("pouchdb");

const db = new PouchDB("http://felduque:151623@localhost:5984/transacciones");
PouchDB.plugin(require("pouchdb-find"));

const getAllTransacciones = (callback) => {
  db.allDocs({ include_docs: true })
    .then((result) => {
      const transacciones = result.rows.map((row) => row.doc);
      callback(transacciones);
    })
    .catch((err) => {
      console.error(err);
    });
};

const createTransaccion = (transaccion, callback) => {
  db.post(transaccion)
    .then((response) => {
      callback(response);
    })
    .catch((err) => {
      console.error(err);
    });
};

const updateTransaccion = (transaccion, callback) => {
  db.put(transaccion)
    .then((response) => {
      callback(response);
    })
    .catch((err) => {
      console.error(err);
    });
};

const deleteTransaccion = (transaccion, callback) => {
  db.remove(transaccion)
    .then((response) => {
      callback(response);
    })
    .catch((err) => {
      console.error(err);
    });
}


module.exports = {
  getAllTransacciones,
  createTransaccion,
  updateTransaccion,
  updateTransaccion,
  deleteTransaccion
};
