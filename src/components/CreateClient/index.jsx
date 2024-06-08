import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IoMdAdd } from "react-icons/io";

export const CreateClientModal = ({
  modalCreateClient,
  setModalCreateClient,
  handleGetData
}) => {
  const [dataClient, setDataClient] = useState({
    name: "",
    phone: "",
    document: "",
    email: "",
  });


  const handleCreateClient = () => {
    window.api.send("create-client", dataClient);
    window.api.receive("create-client-response", (response) => {
      console.log(response);
      if(response.ok){
        handleGetData();
        setModalCreateClient(false);
      }
    });
  };

  useEffect(() => {
    return () => {
      window.api.remove("create-client-response");
    };
  }, []);
  return (
    <div className="card flex justify-content-center">
      <Button
        icon={<IoMdAdd />}
        rounded
        severity="success"
        outlined
        onClick={() => setModalCreateClient(true)}
      />
      <Dialog
        header="Terminar venta"
        visible={modalCreateClient}
        style={{ maxWidth: "20vw", minHeight: "50vh" }}
        onHide={() => {
          if (!modalCreateClient) return;
          setModalCreateClient(false);
        }}
      >
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg flex-wrap">
          <div className="flex gap-2 flex-wrap w-full justify-between items-center">
            <div className="flex flex-col justify-start">
              <label htmlFor="name">Nombre</label>
              <InputText
                id="name"
                value={dataClient.name}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataClient({ ...dataClient, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col justify-start">
              <label htmlFor="phone">Telefono</label>
              <InputText
                id="phone"
                value={dataClient.phone}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataClient({
                    ...dataClient,
                    phone: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex flex-col justify-start">
              <label htmlFor="document">Documento</label>
              <InputText
                id="document"
                value={dataClient.document}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataClient({
                    ...dataClient,
                    document: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex flex-col justify-start">
              <label htmlFor="email">Correo</label>
              <InputText
                id="email"
                value={dataClient.email}
                className="p-inputtext-sm"
                onChange={(e) =>
                  setDataClient({ ...dataClient, email: e.target.value })
                }
              />
            </div>
          </div>
          <Button label="Crear cliente" onClick={handleCreateClient} />
        </div>
      </Dialog>
    </div>
  );
};
