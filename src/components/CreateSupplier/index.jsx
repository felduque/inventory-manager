import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IoMdAdd } from "react-icons/io";

export const CreateSupplierModal = ({
  modalCreateSupplier,
  setModalCreateSupplier,
  handleGetData,
}) => {
  const [dataSupplier, setDataSupplier] = useState({
    name: "",
    phone: "",
    address: "",
    representative: "",
    phone_representative: "",
  });

  const handleCreateSupplier = () => {
    window.api.send("create-supplier", dataClient);
    window.api.receive("create-supplier-response", (response) => {
      console.log(response);
      if (response.ok) {
        handleGetData();
        setModalCreateSupplier(false);
      }
    });
  };

  useEffect(() => {
    return () => {
      window.api.remove("create-supplier-response");
    };
  }, []);
  return (
    <div className="card flex justify-content-center">
      <Button
        icon={<IoMdAdd />}
        rounded
        severity="success"
        outlined
        onClick={() => setModalCreateSupplier(true)}
      />
      <Dialog
        header="Terminar venta"
        visible={modalCreateSupplier}
        style={{ maxWidth: "50vw", minHeight: "50vh" }}
        onHide={() => {
          if (!modalCreateSupplier) return;
          setModalCreateSupplier(false);
        }}
      >
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg flex-wrap">
          <div className="flex gap-2 flex-wrap w-full justify-between items-center">
            <div className="flex flex-col justify-start">
              <label htmlFor="name">Nombre</label>
              <InputText
                id="name"
                value={dataSupplier.name}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataSupplier({ ...dataSupplier, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col justify-start">
              <label htmlFor="phone">Telefono</label>
              <InputText
                id="phone"
                value={dataSupplier.phone}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataSupplier({ ...dataSupplier, phone: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col justify-start">
              <label htmlFor="address">Direccion</label>
              <InputText
                id="address"
                value={dataSupplier.address}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataSupplier({ ...dataSupplier, address: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col justify-start">
              <label htmlFor="representative">Representante</label>
              <InputText
                id="representative"
                value={dataSupplier.representative}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataSupplier({
                    ...dataSupplier,
                    representative: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col justify-start">
              <label htmlFor="phone_representative">
                Telefono Representante
              </label>
              <InputText
                id="phone_representative"
                value={dataSupplier.phone_representative}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataSupplier({
                    ...dataSupplier,
                    phone_representative: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <Button label="Crear Supplier" onClick={handleCreateSupplier} />
        </div>
      </Dialog>
    </div>
  );
};
