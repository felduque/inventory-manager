import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { CreateClientModal } from "../CreateClient";
import { CreateSupplierModal } from "../CreateSupplier";
import useToast from "../Alerts/Alerts";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

export const EndSaleModal = ({
  modalEndSale,
  setModalEndSale,
  sellInfo,
  refund,
  inCardItem,
  total,
}) => {
  const [userList, setUserList] = useState({
    options: [],
    value: null,
  });

  const [clientList, setClientList] = useState({
    options: [],
    value: null,
  });
  const navigate = useNavigate();
  const { showToast, toastRef } = useToast();

  const [modalCreateClient, setModalCreateClient] = useState(false);
  const handleCreateTransaction = () => {
    let productsCard = inCardItem.map((item) => {
      return {
        _id: item._id,
        description: item.description,
        sellingPrice: item.sellingPrice,
        barcode: item.barcode,
        quantity: item.quantity,
        iva: item.iva,
      };
    });
    let transaction = {
      ...sellInfo,
      amount_paid: refund,
      products: productsCard,
      totalSale: total,
      sellerName: userList.value.name,
      sellerId: userList.value._id,
      clientName: clientList.value.name,
      clientId: clientList.value._id,
      date: new Date().toLocaleDateString(),
    };
    window.api.send("create-transaction", transaction);
    // hacemos un update a los productos para restar la cantidad vendida y sacar quantity y iva de cada producto
    let products = inCardItem
      .map((item) => {
        return {
          _id: item._id,
          ...item,
          stock: item.stock - item.quantity,
        };
      })
      .map((item) => {
        delete item.quantity;
        delete item.iva;
        return item;
      });

    window.api.send("update-products", products);

    window.api.receive("update-products-response", (response) => {
      if (response.ok) {
        showToast({
          severity: "success",
          summary: "Venta realizada",
          detail: "La venta se ha realizado con éxito",
        });
      }
    });
    setModalEndSale(false);
    setTimeout(() => {
      
      navigate("/menu");
    }, 1000);
  };
  const handleGetData = () => {
    window.api.send("get-all-users");
    window.api.send("get-all-clientes");
    window.api.receive("get-all-users-response", (users) => {
      setUserList({
        ...userList,
        options: users,
      });
    });

    window.api.receive("get-all-clientes-response", (clientes) => {
      setClientList({
        ...clientList,
        options: clientes,
      });
    });
  };

  useEffect(() => {
    handleGetData();
    return () => {
      window.api.remove("get-all-users-response");
      window.api.remove("get-all-clientes-response");
      window.api.remove("create-transaction-response");
      window.api.remove("update-products-response");
    };
  }, []);
  return (
    <div className="card flex justify-content-center">
      <Button
        label="Siguiente"
        raised
        size="small"
        rounded
        severity="primary"
        onClick={() => setModalEndSale(true)}
      />
      <Dialog
        header="Terminar venta"
        visible={modalEndSale}
        style={{ maxWidth: "50vw", minHeight: "50vh" }}
        onHide={() => {
          if (!modalEndSale) return;
          setModalEndSale(false);
        }}
      >
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg">
          <Toast ref={toastRef} />
          <div className="flex gap-2">
            <div className="flex gap-1">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Vendedor</label>
                <Dropdown
                  value={userList.value}
                  options={userList.options}
                  onChange={(e) => setUserList({ ...userList, value: e.value })}
                  optionLabel="name"
                  placeholder="Selecciona un vendedor"
                  className="w-full md:w-14rem"
                />
              </div>
            </div>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Cliente</label>
                <Dropdown
                  value={clientList.value}
                  options={clientList.options}
                  onChange={(e) =>
                    setClientList({ ...clientList, value: e.value })
                  }
                  optionLabel="name"
                  placeholder="Selecciona un cliente"
                  className="w-full md:w-14rem"
                />
              </div>
              <CreateClientModal
                modalCreateClient={modalCreateClient}
                setModalCreateClient={setModalCreateClient}
                handleGetData={handleGetData}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              label="Finalizar venta"
              raised
              size="small"
              rounded
              severity="success"
              onClick={() => handleCreateTransaction()}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
