import { Dialog } from "primereact/dialog";
import React, { createContext, useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";

import { DataTable } from "primereact/datatable";
import { ImPrinter } from "react-icons/im";

import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import JsBarcode from "jsbarcode";
import toBlob from "canvas-to-blob";
import { FactureState } from "../../helper/InitialState/Global";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { CiBarcode, CiImageOn } from "react-icons/ci";
import { Tooltip } from "primereact/tooltip";
import { IoIosAddCircleOutline } from "react-icons/io";
import { InputNumber } from "primereact/inputnumber";
import { CreateProductFacture } from "./CreateProductFacture";
import { EditProductFacture } from "./EditProductFacture";
import { FaPencil } from "react-icons/fa6";
import { BarcodeList, PrintFactureBarcode } from "../../helper/PrintBarCode";
import useToast from "../Alerts/Alerts";

const ItemsFactureContext = createContext();

export const CreateFacture = ({
  inputModalVisible,
  handleCloseModalCreateProduct,
  handleGetAllProducts,
  search,
}) => {
  const [data, setData] = useState(FactureState);
  const [factureItems, setFactureItems] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [suppliers, setSuppliers] = useState({
    options: [],
    selectedSupplier: null,
  });
  const { showToast, toastRef } = useToast();
  const [productFactureModal, setProductFactureModal] = useState(false);
  const [EditModalProductVisible, setEditModalProductVisible] = useState(false);
  const [saveFacture, setSaveFacture] = useState("");
  const createFacture = () => {
    window.api.send("create-factura", data);
    window.api.receive("create-factura-response", (resData) => {
      if (resData.ok) {
        setSaveFacture(resData.id);
      }
    });
  };

  useEffect(() => {
    if (saveFacture) {
      const newFactureItems = factureItems.map((item) => {
        return {
          ...item,
          factureId: saveFacture,
          numInvoice: data.numFacture,
          isCompleteFacture: true,
          supplier: data.supplier,
        };
      });

      window.api.send("update-products", newFactureItems);
      window.api.receive("update-products-response", (res) => {
        if (res.ok) {
          handleGetAllProducts(search);
          showToast(
            "success",
            "Factura Creada",
            "La factura ha sido creada con exito",
          )
          setTimeout(() => {
          handleCloseModalCreateProduct("createFacture");

          }, 1000);
        }
      });
    }
    window.api.send("get-all-suppliers");
    window.api.receive("get-all-suppliers-response", (suppliers) => {
      setSuppliers((prev) => ({
        ...prev,
        options: suppliers,
      }));
    });
    return () => {
      setData(FactureState);
      setSuppliers({ options: [], selectedSupplier: null });
      window.api.remove("get-all-suppliers-response");
      window.api.remove("create-factura-response");
    };
  }, [saveFacture]);


  return (
    <Dialog
      header="Crear Factura"
      className="w-10/12"
      visible={inputModalVisible}
      onHide={() => {
        console.log("close");
        handleCloseModalCreateProduct("createFacture");
      }}
    >
      <ItemsFactureContext.Provider value={{ factureItems, setFactureItems }}>
        <div className="flex flex-col bg-gray-200 w-full p-2 gap-2">
          <Toast ref={toastRef} />
          {productFactureModal && (
            <CreateProductFacture
              inputModalVisible={productFactureModal}
              handleCloseModalCreateProductFacture={() =>
                setProductFactureModal(false)
              }
            />
          )}
          {EditModalProductVisible && (
            <EditProductFacture
              EditModalProductVisible={EditModalProductVisible}
              dataProduct={dataEdit}
              handleCloseModalEditProductFacture={() =>
                setEditModalProductVisible(false)
              }
            />
          )}
          <div className="flex gap-2 flex-col bg-white p-2 rounded-t-lg">
            {/* inputs */}
            <div className="flex justify-between gap-1 flex-wrap w-full">
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="Provedor">
                  Provedor
                </label>
                <div className="flex items-center gap-1">
                  <Dropdown
                    className="p-inputtext-sm"
                    onChange={(e) => {
                      setSuppliers({
                        ...suppliers,
                        selectedSupplier: e.value,
                      });
                      setData({ ...data, supplier: e.value.name });
                    }}
                    options={suppliers.options}
                    value={suppliers.selectedSupplier}
                    optionLabel="name"
                    placeholder="Seleccione un Provedor"
                  />
                  <IoIosAddCircleOutline className="text-success w-6 h-6 cursor-pointer" />
                </div>
              </div>
              <div className="flex flex-col ">
                <label className="font-semibold" htmlFor="factura">
                  Numero de factura
                </label>
                <InputText
                  className="p-inputtext-sm"
                  value={data.numFacture}
                  onChange={(e) =>
                    setData({ ...data, numFacture: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-evenly gap-1 flex-wrap w-full">
              <div className="flex flex-col ">
                <label className="font-semibold" htmlFor="Provedor">
                  Fecha
                </label>
                <Calendar
                  className="p-inputtext-sm"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.value })}
                />
              </div>
              <div className="flex flex-col ">
                <label className="font-semibold" htmlFor="Provedor">
                  Fecha de pago estimado
                </label>
                <Calendar
                  className="p-inputtext-sm"
                  value={data.estimatedPayDate}
                  onChange={(e) =>
                    setData({ ...data, estimatedPayDate: e.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center bg-white p-2">
            <div className="flex gap-2 items-center">
              <label className="font-semibold">PRODUCTOS</label>
              {/* El Input solo tendra la barra Bottom */}
              <input type="text" className="border-b-2 w-full" />
            </div>
            <IoIosAddCircleOutline
              className="text-success w-6 h-6 cursor-pointer"
              onClick={() => setProductFactureModal(true)}
            />
          </div>
          <div className="w-full bg-gray-300 flex flex-col gap-2 p-2 overflow-y-auto">
            <DataTable
              value={factureItems}
              className="p-datatable-sm"
              key="_id"
              scrollable
              scrollHeight="1000px"
              paginator
              rows={20}
              rowsPerPageOptions={[20, 50, 100]}
            >
              <Column
                headerStyle={{ width: "3rem" }}
                bodyStyle={{ textAlign: "center" }}
                header="Editar"
                body={(rowData) => (
                  <Button
                    icon={<FaPencil />}
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setDataEdit(rowData);
                      setEditModalProductVisible(true);
                    }}
                  />
                )}
              />
              <Column field="numInvoice" header="# Factura" />
              <Column field="reference" header="Referencia" />
              <Column field="size" header="Talla" />
              <Column field="promotion" header="Desc" />
              <Column field="priceForUnits" header="Precio X Unidad" />
              <Column
                field="total"
                header="Total"
                body={(rowData) => (
                  <span>
                    ${" "}
                    {(rowData.stock * rowData.priceForUnits).toLocaleString(
                      "es-CO",
                    )}
                  </span>
                )}
              />
            </DataTable>
          </div>
          <div className="flex justify-evenly gap-1 flex-wrap w-full">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <label className="font-semibold" htmlFor="IVA">
                  IVA
                </label>
                <Checkbox
                  checked={data.ivaAuto}
                  onChange={(e) => setData({ ...data, ivaAuto: e.checked })}
                />
              </div>
              <InputNumber
                className="p-inputtext-sm"
                prefix="$"
                // Iva 19%
                value={
                  data.ivaAuto
                    ? factureItems.reduce(
                        (acc, item) => acc + item.priceForUnits * item.stock,
                        0,
                      ) * 0.19
                    : data.ivaValue
                }
                onChange={(e) => setData({ ...data, ivaValue: e.value })}
                disabled={!data.ivaAuto}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="Envio">
                Envio
              </label>
              <InputNumber
                className="p-inputtext-sm"
                prefix="$"
                value={data.sendValue}
                onChange={(e) => setData({ ...data, sendValue: e.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="Envio">
                Total Factura
              </label>
              <InputNumber
                value={factureItems
                  .reduce(
                    (acc, item) => acc + item.priceForUnits * item.stock,
                    0,
                  )
                  .toLocaleString("es-CO")}
                prefix="$"
                disabled
                className="p-inputtext-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between flex-wrap">
            <Button
              label="Cancelar"
              className="p-button-danger"
              onClick={() => handleCloseModalCreateProduct("createFacture")}
            />
            {factureItems.length > 0 && (
              <PrintFactureBarcode items={factureItems} />
            )}
            <Button
              label="Guardar Producto"
              className="p-button-primary"
              onClick={createFacture}
            />
          </div>
        </div>
      </ItemsFactureContext.Provider>
    </Dialog>
  );
};

export const useItemsFacture = () => useContext(ItemsFactureContext);
