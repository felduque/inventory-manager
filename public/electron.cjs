const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

const {
  getUser,
  updateUser,
  createUser,
  getAllUsers,
  closeDatabase,
} = require("../src/database/conections.cjs");
const {
  searchProduct,
  getProduct,
  updateProduct,
  createProduct,
  closeDatabaseInventory,
  getAllProducts,
  updateProducts,
  deleteProductIds,
} = require("../src/database/inventario/inventario.cjs");
const {
  createFactura,
  getFactura,
  updateFactura,
  deleteFactura,
  closeDBFacturas,
  getAllFacturas,
} = require("../src/database/facturas/index.cjs");

const {
  createTransaccion,
  getAllTransacciones,
  updateTransaccion,
  deleteTransaccion
} = require("../src/database/transacciones/transacciones.cjs");

const {
  createSupplier,
  getAllSuppliers,
} = require("../src/database/provedores/provedores.cjs");

const {
  getAllClientes,
  createCliente,
  updateCliente,
} = require("../src/database/clientes/index.cjs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },});

  // if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:6969");
    win.webContents.openDevTools();
  // } else {
  //   win.loadFile(path.join(__dirname, "dist/index.html"));
  // }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("get-user", (event, id) => {
  getUser(id, (user) => {
    event.reply("get-user-response", user);
  });
});

ipcMain.on("update-user", (event, user) => {
  updateUser(user.id, user.name, user.email, user.password, () => {
    event.reply("update-user-response", { success: true });
  });
});

ipcMain.on("create-user", (event, user) => {
  createUser(user.name, user.email, user.password, () => {
    event.reply("create-user-response", { success: true });
  });
});

// Clients

ipcMain.on("get-all-clientes", (event) => {
  getAllClientes((clientes) => {
    event.reply("get-all-clientes-response", clientes);
  });
})

ipcMain.on("create-client", (event, cliente) => {
  createCliente(cliente, (response) => {
    event.reply("create-client-response", response);
  });
})

ipcMain.on("update-client", (event, cliente) => {
  updateCliente(cliente, (response) => {
    event.reply("update-client-response", response);
  });
})

// inventario

ipcMain.on("get-all-users", (event) => {
  getAllUsers((users) => {
    event.reply("get-all-users-response", users);
  });
});

ipcMain.on("search-product", (event, { replyName, data }) => {
  searchProduct(data, (products) => {
    event.reply(
      `search-product-response${replyName && `-${replyName}`}`,
      products,
    );
  });
});

ipcMain.on("get-product", (event, { replyName, data }) => {
  getProduct(data, (product) => {
    event.reply(`get-product-response${replyName && `-${replyName}`}`, product);
  });
});

ipcMain.on("update-product", (event, product) => {
  updateProduct(product, () => {
    event.reply("update-product-response", { success: true });
  });
});

ipcMain.on("update-products", (event, products) => {
  updateProducts(products, (response) => {
    event.reply("update-products-response", response);
  });
});

ipcMain.on("create-product", (event, { replyName, data }) => {
  createProduct(data, (createdProduct) => {
    event.reply(
      `create-product-response${replyName && `-${replyName}`}`,
      createdProduct,
    );
  });
});

ipcMain.on("delete-products-ids", (event, ids) => {
  deleteProductIds(ids, () => {
    event.reply("delete-products-ids-response", { success: true });
  });
});

ipcMain.on("get-all-products", (event) => {
  getAllProducts((products) => {
    event.reply("get-all-products-response", products);
  });
});

// Transacciones

ipcMain.on("get-all-transactions", (event) => {
  getAllTransacciones((transactions) => {
    event.reply("get-all-transactions-response", transactions);
  });
});

ipcMain.on("create-transaction", (event, search) => {
  createTransaccion(search, (transactions) => {
    event.reply("create-transaction-response", transactions);
  });
});

ipcMain.on("update-transaction", (event, transaction) => {
  updateTransaccion(transaction, () => {
    event.reply("update-transaction-response", { success: true });
  });
})

ipcMain.on("delete-transaction", (event, transaction) => {
  deleteTransaccion(transaction, () => {
    event.reply("delete-transaction-response", { success: true });
  });
})

//  Save imagen disco local C y retorna la ruta para guardar en la base de datos

ipcMain.handle("save-image", (event, { imageData, imageName }) => {
  const directoryPath = path.join("C:", "inventoryManagerImages");

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  const imagePath = path.join(directoryPath, imageName);
  fs.writeFileSync(imagePath, imageData);

  // Convert image to Base64
  const imageAsBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

  return `data:image/png;base64,${imageAsBase64}`;
});

// Proveedores

ipcMain.on("create-supplier", (event, supplier) => {
  createSupplier(supplier, () => {
    event.reply("create-supplier-response", { success: true });
  });
});

ipcMain.on("get-all-suppliers", (event) => {
  getAllSuppliers((suppliers) => {
    event.reply("get-all-suppliers-response", suppliers);
  });
});

// Facturas

ipcMain.on("create-factura", (event, factura) => {
  createFactura(factura, (response) => {
    event.reply("create-factura-response", response);
  });
});

ipcMain.on("get-factura", (event, id) => {
  getFactura(id, (factura) => {
    event.reply("get-factura-response", factura);
  });
});

ipcMain.on("update-factura", (event, factura) => {
  updateFactura(factura, () => {
    event.reply("update-factura-response", { success: true });
  });
});

ipcMain.on("delete-factura", (event, factura) => {
  deleteFactura(factura, () => {
    event.reply("delete-factura-response", { success: true });
  });
});

ipcMain.on("get-all-facturas", (event) => {
  getAllFacturas((facturas) => {
    event.reply("get-all-facturas-response", facturas);
  });
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas, excepto en macOS. En macOS, es común para las aplicaciones y su barra de menú para permanecer activas hasta que el usuario salga explícitamente con Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Cerrar la conexión a la base de datos cuando la aplicación se cierre.
app.on("before-quit", () => {
  closeDatabase(() => {
    console.log("Database closed Users");
  });

  closeDatabaseInventory(() => {
    console.log("Database closed Inventory");
  });
  closeDBFacturas(() => {
    console.log("Database closed Facturas");
  });
});
