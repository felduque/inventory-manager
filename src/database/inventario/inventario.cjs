const PouchDB = require("pouchdb");

const db = new PouchDB("http://felduque:151623@localhost:5984/inventario");
PouchDB.plugin(require("pouchdb-find"));

/**
  formato datos
  {
  "_id": "9054715f60dadc27b7a43f50ec0009a2",
  "_rev": "1-71f1a11430ba7f128c4a4beaf43809fa",
  "id-group": 1,
  "use-inventory-stock": "YES",
  "purchase-price": 39,
  "sold-for": "UNIT",
  "min-stock": 0,
  "as-of": 0,
  "status": "ACTIVE",
  "description": "Ropa para hombre",
  "stock": 123,
  "sell-price": 50,
  "wholesale-price": 45,
  "talla": "M",
  "color": "green",
  "reference": 23312
}
 */

// filtro avanazado
const searchProduct = (search, callback) => {
  db.allDocs({
    include_docs: true,
  })
    .then((result) => {
      const products = result.rows.map((row) => row.doc);
      let filteredProducts;

      if (Array.isArray(search)) {
        filteredProducts = products.filter((product) =>
          search.some(
            (term) =>
              (product.description &&
                product.description.match(new RegExp(term, "i"))) ||
              (product.reference &&
                product.reference.toString().match(new RegExp(term, "i"))) ||
              (product.color && product.color.match(new RegExp(term, "i"))) ||
              (product.barcode && product.barcode === term) ||
              (product.talla && product.talla.match(new RegExp(term, "i"))),
          ),
        );
      } else {
        const regex = new RegExp(search, "i");
        filteredProducts = products.filter(
          (product) =>
            (product.description && product.description.match(regex)) ||
            (product.reference && product.reference.toString().match(regex)) ||
            (product.color && product.color.match(regex)) ||
            (product.barcode && product.barcode === search) ||
            (product.talla && product.talla.match(regex)),
        );
      }

      callback(filteredProducts);
    })
    .catch((err) => {
      console.error(err);
    });
};

const getProduct = (id, callback) => {
  db.get(id)
    .then((doc) => {
      callback(doc);
    })
    .catch((err) => {
      console.error(err);
    });
};

const updateProduct = (product, callback) => {
  db.put(product)
    .then(() => {
      callback();
    })
    .catch((err) => {
      console.error(err);
    });
};

// funcion para actualizar varios productos

const updateProducts = (products, callback) => {
  db.allDocs({
    include_docs: true,
  })
    .then((result) => {
      const productsDB = result.rows.map((row) => row.doc);
      products.forEach((product) => {
        const productDB = productsDB.find((p) => p._id === product._id);
        if (productDB) {
          product._rev = productDB._rev;
          db.put(product)
            .then((doc) => {
              callback(doc);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const createProduct = (product, callback) => {
  db.post(product)
    .then((insertedProduct) => {
      callback(insertedProduct);
    })
    .catch((err) => {
      console.error(err);
    });
};

// eliminar por ids que llegan en array de string ['id1', 'id2', 'id3']
const deleteProductIds = (ids, callback) => {
  db.allDocs({
    include_docs: true,
  })
    .then((result) => {
      const products = result.rows.map((row) => row.doc);
      const productsToDelete = products.filter((product) =>
        ids.includes(product._id),
      );
      productsToDelete.forEach((product) => {
        db.remove(product)
          .then(() => {
            callback();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const getAllProducts = (callback) => {
  db.allDocs({ include_docs: true })
    .then((result) => {
      const products = result.rows.map((row) => row.doc);
      callback(products);
    })
    .catch((err) => {
      console.error(err);
    });
};

const closeDatabaseInventory = () => {
  db.close();
};

module.exports = {
  searchProduct,
  updateProducts,
  getProduct,
  updateProduct,
  createProduct,
  closeDatabaseInventory,
  getAllProducts,
  deleteProductIds,
};
