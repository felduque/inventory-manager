import React, { createContext, useContext, useEffect, useState } from "react";
import { CardSellProduct } from "../../components/CardSellProduct/CardSellProduct";
import { CardInvoice } from "../../components/CardInvoice/CardInvoice";
import { BiSearch } from "react-icons/bi";
import { FetchInventory } from "../../helper/FetchInventory/FetchInventory";
import { useDebounce } from "primereact/hooks";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { EndSaleModal } from "../../components/ModalEndSale";
import { Chips } from "primereact/chips";

const CardItemContext = createContext();

export const Sell = () => {
  const [listProducts, setListProducts] = useState([]);
  const [inCardItem, setInCardItem] = useState([]);
  const [iva, setIva] = useState(true);
  const [refund, setRefund] = useState(0);
  const [inputValue, debouncedValue, setInputValue] = useDebounce([], 400);
  const [modalEndSale, setModalEndSale] = useState(false);
  const [sellInfo, setSellInfo] = useState({
    discountType: "percentage",
    discountValue: 0,
    paymentType: "cash",
  });

  useEffect(() => {
    FetchInventory(debouncedValue);
    window.api.receive("get-all-products-response", (products) => {
      setListProducts(products);
    });

    window.api.receive("search-product-response-inventory", (products) => {
      setListProducts(products);
    });

    return () => {
      window.api.remove("get-all-products-response");
      window.api.remove("search-product-response-inventory");
      window.api.remove("delete-products-ids-response");
    };
  }, [debouncedValue]);

  useEffect(() => {
    if (debouncedValue.length > 0) {
      const barcode = debouncedValue[debouncedValue.length - 1]; // Last scanned barcode
      const foundProduct = listProducts.find(
        (product) => product.barcode === barcode,
      );

      if (foundProduct) {
        const productInCart = inCardItem.find(
          (item) => item._id === foundProduct._id,
        );

        if (productInCart) {
          setInCardItem((prevItems) =>
            prevItems.map((item) =>
              item._id === foundProduct._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          );
        } else {
          setInCardItem((prevItems) => [
            ...prevItems,
            { ...foundProduct, quantity: 1, iva: true},
          ]);
        }
      }
    }
  }, [debouncedValue]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "F1":
          setRefund((prev) => prev + 1000);
          break;
        case "F2":
          setRefund((prev) => prev + 2000);
          break;
        case "F3":
          setRefund((prev) => prev + 5000);
          break;
        case "F4":
          setRefund((prev) => prev + 10000);
          break;
        case "F5":
          setRefund((prev) => prev + 20000);
          break;
        case "F6":
          setRefund((prev) => prev + 50000);
          break;
        case "F7":
          setRefund((prev) => prev + 100000);
          break;
        case "F8":
          setRefund(
            inCardItem.reduce((acc, item) => {
              return (
                acc + item.sellingPrice * item.quantity * (item.iva ? 1 : 0.81)
              );
            }, 0),
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inCardItem]);

  const handleApplyIvaAll = (e) => {
    setIva(e.target.checked);
    let newObject = inCardItem.map((item) => {
      item.iva = e.target.checked;
      return item;
    });
    setInCardItem(newObject);
  };

  const calculateTotal = () => {
    const total = inCardItem.reduce((acc, item) => {
      return acc + item.sellingPrice * item.quantity * (item.iva ? 1 : 0.81);
    }, 0);

    let discountAmount = 0;
    if (sellInfo.discountType === "percentage") {
      discountAmount = total * (sellInfo.discountValue / 100);
    } else if (sellInfo.discountType === "value") {
      discountAmount = sellInfo.discountValue;
    }

    return total - discountAmount;
  };

  console.log(debouncedValue);

  return (
    <CardItemContext.Provider value={{ inCardItem, setInCardItem }}>
      <div className="w-full h-full bg-gray-200 grid grid-cols-12 gap-1">
        <div className="col-span-9 flex flex-col items-center gap-2 p-1">
          <div className="h-16 w-full p-2 rounded-t-lg flex shadow-shPrimary bg-white">
            {/* Input de búsqueda */}
            <Chips
              className="p-inputtext-sm"
              value={inputValue}
              onChange={(e) => {
                const newValue = e.value.filter(
                  (value, index, self) => self.indexOf(value) === index,
                );
                setInputValue(newValue);
              }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 bg-white w-full h-full overflow-y-auto sm:grid-cols-6 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 pr-2 pl-2 p-2 pb-2">
            {/* Body Productos */}
            {listProducts.map((product) => {
              return <CardSellProduct key={product._id} product={product} />;
            })}
          </div>
        </div>
        <div className="col-span-3 bg-gray-200 flex flex-col gap-1 p-1">
          <div className="h-16 w-full bg-white p-2 shadow-shPrimary rounded-t-lg flex gap-1 justify-between">
            <div>
              <p className="text-gray-900 text-2xl font-bold md:text-base font-header">
                Resumen de la Orden
              </p>
              <p className="text-gray-900 text-2xl font-bold md:text-base font-header">
                # 2313
              </p>
            </div>
            <EndSaleModal
              modalEndSale={modalEndSale}
              setModalEndSale={setModalEndSale}
              sellInfo={sellInfo}
              refund={refund}
              inCardItem={inCardItem}
              total={calculateTotal()}
            />
          </div>
          <div className="w-full p-1 flex flex-col gap-2 bg-white max-h-96 overflow-y-auto rounded-lg shadow-shPrimary">
            {/* Body Carrito */}
            {inCardItem.length > 0 ? (
              inCardItem.map((product) => {
                return <CardInvoice key={product._id} product={product} />;
              })
            ) : (
              <img
                src="https://i.ibb.co/pZHKjzh/869636.png"
                alt="empty-cart"
                className="w-full h-52 object-cover"
              />
            )}
          </div>
          <div className="w-full p-4 bg-white rounded-b-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-header md:text-lg md:font-semibold md:mb-2 md:font-header">
              Resumen de Pago
            </h2>
            <div className="space-y-1">
              <div className="flex justify-between md:flex-col md:items-start lg:flex-row">
                <span className="text-gray-500 text-lg font-semibold md:text-sm">
                  Total de la compra:
                </span>
                <p className="font-medium text-gray-800 text-lg">
                  <span className="font-semibold text-sm text-gray-400">$</span>
                  {calculateTotal().toFixed(2).toLocaleString("es-CO")}
                </p>
              </div>
              <div className="flex justify-between flex-col md:items-start">
                <label className="text-gray-500 text-lg font-semibold md:text-sm">
                  Dinero entregado:
                </label>
                <InputNumber
                  value={refund}
                  onValueChange={(e) => setRefund(e.value)}
                  className="p-inputtext-sm"
                  prefix="$"
                />
              </div>
              <div className="flex justify-between flex-col md:items-start">
                <label className="text-gray-500 text-lg font-semibold md:text-sm">
                  Tipo de Descuento:
                </label>
                <div className="flex gap-2">
                  <RadioButton
                    inputId="percentage"
                    name="discountType"
                    value="percentage"
                    onChange={(e) =>
                      setSellInfo({ ...sellInfo, discountType: e.value })
                    }
                    checked={sellInfo.discountType === "percentage"}
                  />
                  <label htmlFor="percentage">Porcentaje</label>
                  <RadioButton
                    inputId="value"
                    name="discountType"
                    value="value"
                    onChange={(e) =>
                      setSellInfo({ ...sellInfo, discountType: e.value })
                    }
                    checked={sellInfo.discountType === "value"}
                  />
                  <label htmlFor="value">Valor</label>
                </div>
              </div>
              <div className="flex justify-between flex-col md:items-start">
                <label className="text-gray-500 text-lg font-semibold md:text-sm">
                  {sellInfo.discountType === "percentage"
                    ? "% Descuento:"
                    : "Valor Descuento:"}
                </label>
                <InputNumber
                  value={sellInfo.discountValue}
                  onValueChange={(e) =>
                    setSellInfo({ ...sellInfo, discountValue: e.value })
                  }
                  className="p-inputtext-sm"
                  prefix={sellInfo.discountType === "percentage" ? "%" : "$"}
                />
              </div>
              <div className="flex items-center justify-between md:items-start lg:flex-row">
                <label className="text-gray-500 text-lg font-semibold md:text-sm">
                  Retirar Iva a Todos:
                </label>
                <input
                  id="iva"
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={iva}
                  onChange={handleApplyIvaAll}
                />
              </div>
              <div className="flex justify-between md:flex-col md:items-start lg:flex-row">
                <span className="text-gray-500 text-lg font-semibold md:text-sm">
                  Devolución:
                </span>
                <p className="font-medium text-gray-800 text-lg">
                  <span className="font-semibold text-sm text-gray-400">$</span>
                  {refund
                    ? (refund - calculateTotal())
                        .toFixed(2)
                        .toLocaleString("es-CO")
                    : "0.00"}
                </p>
              </div>

              <div className="flex justify-between flex-col md:items-start">
                <label className="text-gray-500 text-lg font-semibold md:text-sm">
                  Metodo de Pago:
                </label>
                <div className="flex gap-2">
                  <RadioButton
                    inputId="cash"
                    name="cash"
                    value="cash"
                    onChange={(e) =>
                      setSellInfo({ ...sellInfo, paymentType: e.value })
                    }
                    checked={sellInfo.paymentType === "cash"}
                  />
                  <label htmlFor="percentage">Efectivo</label>
                  <RadioButton
                    inputId="transfer"
                    name="transfer"
                    value="transfer"
                    onChange={(e) =>
                      setSellInfo({ ...sellInfo, paymentType: e.value })
                    }
                    checked={sellInfo.paymentType === "transfer"}
                  />
                  <label htmlFor="value">Transaccion</label>
                </div>
              </div>

              <div className="border-b-2 border-gray-300"></div>
              <div className="flex justify-between md:flex-col md:items-start lg:flex-row">
                <span className="text-gray-500 text-lg font-semibold md:text-sm">
                  Iva (19%):
                </span>
                <p className="font-medium text-gray-800 text-lg">
                  <span className="font-semibold text-sm text-gray-400">$</span>
                  {inCardItem
                    .reduce((acc, item) => {
                      return (
                        acc +
                        item.sellingPrice *
                          item.quantity *
                          (item.iva ? 0.19 : 0)
                      );
                    }, 0)
                    .toFixed(2)
                    .toLocaleString("es-CO")}
                </p>
                <span className="text-gray-500 text-lg font-semibold md:text-sm">
                  Total:
                </span>
                <p className="font-medium text-gray-800 text-lg">
                  <span className="font-semibold text-sm text-gray-400">$</span>
                  {calculateTotal().toFixed(2).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardItemContext.Provider>
  );
};

export const useCardItem = () => useContext(CardItemContext);
