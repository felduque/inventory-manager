import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState } from "react";
import { FaExclamation, FaRegTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { CreateProduct } from "../../components/CreateProduct/CreateProduct";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import useToast from "../../components/Alerts/Alerts";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import * as XLSX from "xlsx";
import { CreateFacture } from "../../components/CreateFacture/CreateFacture";

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { toastRef, showToast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [visiblModalCreateFacture, setVisiblModalCreateFacture] =
    useState(false);

  const handleGetAllProducts = (value) => {
    if (value.length > 0) {
      window.api.send("search-product", { data: value });
    } else {
      window.api.send("get-all-products");
    }
  };

  const handleCloseModalCreateProduct = (value) => {
    if (value === "createFacture") {
      console.log(value);
      setVisiblModalCreateFacture(false);
    } else {
      setInputModalVisible(false);
    }
  };

  useEffect(() => {
    handleGetAllProducts(search);

    window.api.receive("get-all-products-response", (products) => {
      setProducts(products);
    });

    window.api.receive("search-product-response", (products) => {
      setProducts(products);
    });

    window.api.receive("create-product-response-individual", (arg) => {
      console.log(arg);
      if (!visiblModalCreateFacture && !inputModalVisible) {
        if (arg.ok) {
          showToast(
            "success",
            "Producto creado",
            "El producto ha sido creado con exito",
          );
          handleGetAllProducts(search);
          handleCloseModalCreateProduct("createProduct");
        } else {
          showToast(
            "error",
            "Error al crear producto",
            "Ha ocurrido un error al crear el producto nalgas",
          );
        }
      }
    });

    window.api.receive("delete-products-ids-response", (arg) => {
      if (arg.success) {
        showToast(
          "success",
          "Producto eliminado",
          "El producto ha sido eliminado con exito",
        );
        handleGetAllProducts(search);
      } else {
        showToast(
          "error",
          "Error al eliminar producto",
          "Ha ocurrido un error al eliminar el producto",
        );
      }
    });

    return () => {
      window.api.remove("get-all-products-response");
      window.api.remove("search-product-response");
      window.api.remove("create-product-response-individual");
      window.api.remove("get-all-suppliers-response");
      window.api.remove("delete-products-ids-response");
    };
  }, [search, visiblModalCreateFacture]);

  const handleDeleteProductsForId = () => {
    let ids = selectedProducts.map((e) => e._id);
    confirmDialog({
      message: "¿Estas seguro de eliminar los productos seleccionados?",
      header: "Confirmar",
      icon: <FaExclamation />,
      accept: () => {
        window.api.send("delete-products-ids", ids);
      },
      reject: () => {
        showToast("info", "Operación cancelada", "No se eliminaron productos");
      },
    });
  };

  const header = (
    <div className="flex flex-wrap items-items-center justify-between gap-2">
      <span className="text-xl text-900 font-bold">Listado de Productos</span>
      <div className="flex flex-wrap items-items-center justify-between gap-2">
        <InputText
          value={search}
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleGetAllProducts(search);
            }
          }}
        />
        <Button
          size="small"
          icon={<IoReload size={20} />}
          rounded
          raised
          onClick={() => handleGetAllProducts(search)}
        />
      </div>
    </div>
  );
  const footer = `Total de productos en inventario ${
    products ? products.length : 0
  }`;

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          size="small"
          label="Crear producto Individual"
          icon={<IoIosAddCircleOutline size={20} />}
          severity="success"
          onClick={() => setInputModalVisible(true)}
        />
        <Button
          size="small"
          label="Ingreso por Factura"
          icon={<IoIosAddCircleOutline size={20} />}
          severity="success"
          onClick={() => setVisiblModalCreateFacture(true)}
        />
        <Button
          size="small"
          label="Eliminar Producto"
          icon={<FaRegTrashAlt size={20} />}
          className="p-button-danger"
          onClick={() => handleDeleteProductsForId()}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        size="small"
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={handleExportDataXLSX}
      />
    );
  };

  const handleExportDataXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, "productos.xlsx");
  };

  return (
    <div className="w-full h-full bg-white">
      <Toast ref={toastRef} />
      <ConfirmDialog />
      <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />
      {inputModalVisible && (
        <CreateProduct
          inputModalVisible={inputModalVisible}
          handleCloseModalCreateProduct={handleCloseModalCreateProduct}
        />
      )}
      {visiblModalCreateFacture && (
        <CreateFacture
          inputModalVisible={visiblModalCreateFacture}
          handleCloseModalCreateProduct={handleCloseModalCreateProduct}
          handleGetAllProducts={handleGetAllProducts}
          search={search}
        />
      )}
      <DataTable
        value={products}
        className="p-datatable-sm"
        paginator
        rows={10}
        showGridlines
        rowsPerPageOptions={[5, 10, 15]}
        selection={selectedProducts}
        selectionMode="checkbox"
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="_id"
        header={header}
        footer={footer}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

        <Column
          className="text-black whitespace-nowrap bg-boxAcent text-ellipsis overflow-hidden text-xs"
          field="reference"
          header="Referencia"
        />

        <Column
          className="text-black whitespace-nowrap bg-boxAcent text-ellipsis overflow-hidden text-xs"
          field="description"
          header="Description"
        />
        <Column
          className="text-black whitespace-nowrap bg-boxAcent text-ellipsis overflow-hidden text-xs"
          field="supplier"
          header="Proveedor"
        />
        <Column
          className="text-black whitespace-nowrap bg-boxAcent text-ellipsis overflow-hidden text-xs"
          field="numInvoice"
          header="# Factura"
        />
        <Column
          className="text-black whitespace-nowrap bg-boxAcent text-ellipsis overflow-hidden text-xs"
          field="sellingPrice"
          header="Precio de venta"
        />
        <Column
          className="text-black whitespace-nowrap bg-boxAcent text-ellipsis overflow-hidden text-xs"
          field="stock"
          header="Stock"
        />
        <Column
          className="text-black whitespace-nowrap bg-boxAcent text-ellipsis overflow-hidden text-xs"
          field="size"
          header="Talla"
        />
      
      </DataTable>
    </div>
  );
};
