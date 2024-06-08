import { Dialog } from "primereact/dialog";
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { CiBarcode, CiCircleAlert, CiImageOn } from "react-icons/ci";
import useToast from "../../Alerts/Alerts";
import { ItemState } from "../../../helper/InitialState/Global";
import { useItemsFacture } from "../CreateFacture";
import { Toast } from "primereact/toast";
import { GenerateRandomString } from "../../../helper/GenerateRandomString";
import { useDebounce } from "primereact/hooks";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

export const EditProductFacture = ({
  EditModalProductVisible,
  handleCloseModalEditProductFacture,
  dataProduct,
}) => {
  const [data, debouncedData, setData] = useDebounce(ItemState, 1000);
  const { showToast, toastRef } = useToast();
  const { factureItems, setFactureItems } = useItemsFacture();
  const [suppliers, setSuppliers] = useState({
    options: [],
    selectedSupplier: null,
  });

  const [isValibleBarcode, setIsValibleBarcode] = useState(false);
  const [optionalGenerateBarcode, setOptionalGenerateBarcode] = useState(false);

  const handleEditProduct = () => {
    let newObj = {
      ...data,
      isFacture: true,
      isCompleteFacture: false,
    };
    window.api.send("update-product", newObj);
  };

  const calculateSellingPrice = () => {
    return (
      data.priceForUnits + (data.priceForUnits * data.estimatedProfit) / 100
    );
  };

  useEffect(() => {
    if (EditModalProductVisible) {
      setData(dataProduct);
    }

    window.api.send("get-all-suppliers");

    window.api.receive("get-all-suppliers-response", (suppliers) => {
      setSuppliers((prev) => ({
        ...prev,
        options: suppliers,
      }));
    });

    window.api.receive("update-product-response", (response) => {
      if (response.success) {
        window.api.send("get-product", {
          replyName: "product-edit",
          data: dataProduct._id,
        });
        showToast("success", "Producto actualizado");
      } else {
        showToast("error", "Error al actualizar el producto");
      }
    });

    window.api.receive("get-product-response-product-edit", (product) => {
      setFactureItems((prev) =>
        prev.map((item) => {
          if (item._id === product._id) {
            return product;
          }
          return item;
        }),
      );
      handleCloseModalEditProductFacture();
    });

    window.api.receive("search-product-response-product-edit", (products) => {
      if (products.length > 0) {
        setOptionalGenerateBarcode(true);
      } else {
        setIsValibleBarcode(true);
      }
    });

    return () => {
      window.api.remove("get-all-suppliers-response");
      window.api.remove("search-product-response-product-edit");
    };
  }, [dataProduct]);

  const generateBarcodeData = () => {
    if (
      debouncedData &&
      debouncedData.description &&
      debouncedData.reference &&
      debouncedData.size
    ) {
      const firstLetter = data.description.charAt(0).toUpperCase();
      const barcodeData = `${firstLetter}${data.reference}${data.size}`;
      return barcodeData;
    } else {
      return "";
    }
  };

  const handleUploadImage = async (file, imageName) => {
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = new Uint8Array(event.target.result);
        const imagePath = await window.api.saveImage(imageData, imageName);
        console.log(`Image saved at ${imagePath}`);
        setData({ ...data, image: imagePath });
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(`Failed to save image: ${error}`);
    }
  };

  useEffect(() => {
    if (optionalGenerateBarcode) {
      let newBarcode = `${data.barcode}-${GenerateRandomString(4)}`;
      confirmPopup({
        message: `El codigo de barras sugerido ya existe, ¿Desea usar el siguiente codigo de barras sugerido ${newBarcode}?`,
        icon: <CiCircleAlert className="text-red-500 text-4xl" />,
        acceptClassName: "p-button-danger",
        accept: () => {
          setIsValibleBarcode(true);
          setData({ ...data, barcode: newBarcode });
        },
        reject: () => {
          setIsValibleBarcode(false);
        },
      });
    }
  }, [optionalGenerateBarcode]);

  useEffect(() => {
    if (
      debouncedData.description &&
      debouncedData.reference &&
      debouncedData.size
    ) {
      let barCodeG = generateBarcodeData();
      if (dataProduct.barcode === barCodeG) return;
      setOptionalGenerateBarcode(false);
      setData({ ...data, barcode: barCodeG });
      window.api.send("search-product", {
        replyName: "product-edit",
        data: barCodeG,
      });
    }
  }, [debouncedData.description, debouncedData.reference, debouncedData.size]);

  return (
    <Dialog
      header="Editar Producto"
      className="w-10/12"
      visible={EditModalProductVisible}
      onHide={() => handleCloseModalEditProductFacture()}
    >
      <div className="flex flex-col bg-gray-200 w-full p-2 gap-2">
        <Toast ref={toastRef} />
        <ConfirmPopup />
        <div className="flex items-center gap-1 justify-between">
          <div className="flex flex-col gap-2 flex-grow">
            <div className="flex items-start gap-2 justify-evenly flex-wrap">
              {/* inputs */}
              {/* <div className="flex flex-col">
                <label className="font-semibold" htmlFor="Provedor">
                  Provedor
                </label>
                <Dropdown
                  className="p-inputtext-sm"
                  onChange={(e) => {
                    setSuppliers({ ...suppliers, selectedSupplier: e.value });
                    setData({ ...data, supplier: e.value.name });
                  }}
                  options={suppliers.options}
                  value={suppliers.selectedSupplier}
                  optionLabel="name"
                  placeholder="Seleccione un Provedor"
                />
              </div> */}
              <div className="flex flex-col ">
                <label className="font-semibold" htmlFor="factura">
                  Numero de factura
                </label>
                <InputText
                  className="p-inputtext-sm"
                  value={data.numInvoice}
                  onChange={(e) =>
                    setData({ ...data, numInvoice: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col ">
                <label className="font-semibold" htmlFor="Provedor">
                  Fecha
                </label>
                <Calendar
                  className="p-inputtext-sm"
                  value={new Date(data.date)}
                  onChange={(e) => setData({ ...data, date: e.value })}
                />
              </div>
              <div className="flex flex-col ">
                <label className="font-semibold" htmlFor="Provedor">
                  Referencia
                </label>
                <InputText
                  className="p-inputtext-sm"
                  value={data.reference}
                  onChange={(e) =>
                    setData({ ...data, reference: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="w-full">
              <label className="font-semibold" htmlFor="description">
                Descripcion
              </label>
              <InputText
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                placeholder="Descripcion"
                className="p-inputtext-sm w-full"
              />
            </div>
          </div>
          <div className="shadow-lg p-2 bg-white rounded-lg h-40 items-center justify-center w-40 flex">
            {/* CLICK PARA ABRIR LA EL EXPLORADOR DE ARCHIVOS Y ESCOGER LA IMAGE */}
            {/* SELECCIONAR IMAGE */}
            <input
              type="file"
              id="image-upload"
              style={{ display: "none" }} // Oculta el input
              onChange={(e) => {
                const file = e.target.files[0];
                handleUploadImage(file, file.name);
              }}
              accept="image/*" // Acepta solo imágenes
            />
            {data.image ? (
              <img
                src={data.image.replace(/\\/g, "/")}
                alt="product"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <label htmlFor="image-upload">
                <CiImageOn size={50} />
              </label>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between flex-wrap">
          <div className="flex flex-col">
            <label className="font-semibold" htmlFor="color">
              Talla
            </label>
            <InputText
              value={data.size}
              onChange={(e) => setData({ ...data, size: e.target.value })}
              placeholder="Talla"
              className="p-inputtext-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold" htmlFor="color">
              Color
            </label>
            <InputText
              value={data.color}
              onChange={(e) => setData({ ...data, color: e.target.value })}
              placeholder="Color"
              className="p-inputtext-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold" htmlFor="stock">
              Cantidad de Unidades
            </label>
            <div className="flex items-center gap-2 justify-between flex-wrap w-full">
              <InputNumber
                value={data.stock}
                onValueChange={(e) => setData({ ...data, stock: e.value })}
                className="p-inputtext-sm"
              />
              <Checkbox
                checked={data.infiniteUnits}
                onChange={(e) => setData({ ...data, infiniteUnits: e.checked })}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold" htmlFor="stock">
              Precio por Unidad
            </label>
            <InputNumber
              value={data.priceForUnits}
              onValueChange={(e) =>
                setData({ ...data, priceForUnits: e.value })
              }
              className="p-inputtext-sm"
            />
          </div>
          {/* porcentaje de ganancia estimado */}
          <div className="flex flex-col">
            <label className="font-semibold" htmlFor="stock">
              Ganancia Estimada
            </label>
            <InputNumber
              value={data.estimatedProfit}
              onValueChange={(e) =>
                setData({ ...data, estimatedProfit: e.value })
              }
              className="p-inputtext-sm"
            />
          </div>
          {/* precio de venta sugerido en pesos colombianos*/}
          <div className="flex flex-col">
            <label className="font-semibold" htmlFor="stock">
              Precio de Venta Sugerido
            </label>
            <InputNumber
              value={data.sellingPrice}
              onValueChange={(e) => setData({ ...data, sellingPrice: e.value })}
              className="p-inputtext-sm"
            />
          </div>

          {data.barcode && (
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="stock">
                Codigo de Barras
              </label>
              <div className="shadow-lg bg-white p-2 rounded-lg flex gap-2 items-center">
                <CiBarcode />
                <h3 className="text-2xl font-bold">{data.barcode}</h3>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 justify-between flex-wrap">
          <Button
            label="Cancelar"
            className="p-button-danger"
            onClick={() => handleCloseModalEditProductFacture()}
          />
          <Button
            label="Guardar Producto"
            className="p-button-primary"
            onClick={handleEditProduct}
          />
        </div>
      </div>
    </Dialog>
  );
};
