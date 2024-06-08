const PouchDB = require('pouchdb');

const db = new PouchDB('http://felduque:151623@localhost:5984/facturas');
PouchDB.plugin(require('pouchdb-find'));


const createFactura = (factura, callback) => {
  db.post(factura).then((doc) => {
    callback(doc);
  }).catch(err => {
    console.error(err);
  });
}

const getFactura = (id, callback) => {
  db.get(id).then((doc) => {
    callback(doc);
  }).catch(err => {
    console.error(err);
  });
}

const updateFactura = (factura, callback) => {
  db.get(factura._id).then((doc) => {
    db.put(factura).then(() => {
      callback(doc);
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(err);
  });
}

const deleteFactura = (factura, callback) => {
  db.get(factura._id).then((doc) => {
    db.remove(doc).then(() => {
      callback();
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(err);
  });
}

const getAllFacturas = (callback) => {
  db.allDocs({
    include_docs: true
  }).then((result) => {
    const facturas = result.rows.map(row => row.doc);
    callback(facturas);
  }).catch(err => {
    console.error(err);
  });
}

const closeDBFacturas = () => {
  db.close();
}

module.exports = {
  createFactura,
  getFactura,
  updateFactura,
  deleteFactura,
  closeDBFacturas,
  getAllFacturas
}