import { Dialog } from "primereact/dialog";
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import JsBarcode from "jsbarcode";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { CiBarcode, CiCircleAlert, CiImageOn } from "react-icons/ci";
import { Tooltip } from "primereact/tooltip";
import useToast from "../../Alerts/Alerts";
import { ItemState } from "../../../helper/InitialState/Global";
import { useItemsFacture } from "../CreateFacture";
import { Toast } from "primereact/toast";
import { useDebounce } from "primereact/hooks";
import { GenerateRandomString } from "../../../helper/GenerateRandomString";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

export const CreateProductFacture = ({
  inputModalVisible,
  handleCloseModalCreateProductFacture,
}) => {
  const [data, debouncedData, setData] = useDebounce(ItemState, 1000);
  const { showToast, toastRef } = useToast();
  const { factureItems, setFactureItems } = useItemsFacture();
  const [suppliers, setSuppliers] = useState({
    options: [],
    selectedSupplier: null,
  });

  const [isSellingPriceAuto, setIsSellingPriceAuto] = useState(true);
  const [isValibleBarcode, setIsValibleBarcode] = useState(false);
  const [optionalGenerateBarcode, setOptionalGenerateBarcode] = useState(false);

  const handleSaveProduct = () => {
    let newObj = {
      ...data,
      isFacture: true,
      isCompleteFacture: false,
      sellingPrice: isSellingPriceAuto
        ? calculateSellingPrice()
        : data.sellingPrice,
    };
    window.api.send("create-product", {
      replyName: "facture",
      data: newObj,
    });
  };

  const calculateSellingPrice = () => {
    return (
      data.priceForUnits + (data.priceForUnits * data.estimatedProfit) / 100
    );
  };

  useEffect(() => {
    window.api.send("get-all-suppliers");
    window.api.receive("get-all-suppliers-response", (suppliers) => {
      setSuppliers((prev) => ({
        ...prev,
        options: suppliers,
      }));
    });
    window.api.receive("create-product-response-facture", (response) => {
      if (response.ok) {
        window.api.send("get-product", {
          replyName: "facture-id",
          data: response.id,
        });
      } else {
        showToast("error", "Error al crear producto");
      }
    });
    window.api.receive("get-product-response-facture-id", (product) => {
      const isProductExist = factureItems.some(
        (item) => item._id === product._id,
      );
      if (!isProductExist) {
        setFactureItems((prev) => [...prev, product]);
      }
      showToast("success", "Producto creado", "El producto ha sido creado");
      handleCloseModalCreateProductFacture();
    });

    window.api.receive(
      "search-product-response-product-create-facture",
      (products) => {
        if (products.length > 0) {
          setOptionalGenerateBarcode(true);
        } else {
          setIsValibleBarcode(true);
        }
      },
    );

    return () => {
      window.api.remove("get-all-suppliers-response");
      window.api.remove("create-product-response-facture");
      window.api.remove("get-product-response-facture-id");
      window.api.remove("search-product-response-product-create-facture");
    };
  }, []);

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
      setOptionalGenerateBarcode(false);
      let barCodeG = generateBarcodeData();
      setData({ ...data, barcode: barCodeG });
      window.api.send("search-product", {
        replyName: "product-create-facture",
        data: barCodeG,
      });
    }
  }, [debouncedData.description, debouncedData.reference, debouncedData.size]);

  return (
    <Dialog
      header="Crear Producto"
      className="w-10/12"
      visible={inputModalVisible}
      onHide={() => handleCloseModalCreateProductFacture()}
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
              {/* <div className="flex flex-col ">
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
              </div> */}
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
              prefix="$"
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
              prefix="%"
              className="p-inputtext-sm"
            />
          </div>
          {/* precio de venta sugerido en pesos colombianos*/}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 justify-between flex-wrap w-full">
              <label className="font-semibold" htmlFor="stock">
                Precio de Venta Sugerido
              </label>
              <Checkbox
                checked={isSellingPriceAuto}
                onChange={(e) => setIsSellingPriceAuto(e.checked)}
              />
            </div>
            <InputNumber
              className="p-inputtext-sm"
              value={
                isSellingPriceAuto ? calculateSellingPrice() : data.sellingPrice
              }
              onValueChange={(e) => {
                setIsSellingPriceAuto(false);
                setData({ ...data, sellingPrice: e.value });
              }}
              disabled={isSellingPriceAuto}
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
            onClick={() => handleCloseModalCreateProductFacture()}
          />
          <Button
            label="Guardar Producto"
            className="p-button-primary"
            onClick={handleSaveProduct}
          />
        </div>
      </div>
    </Dialog>
  );
};
