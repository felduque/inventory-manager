import { React, useEffect, useState } from "react";

import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import useToast from "../../../components/Alerts/Alerts";
import { Toast } from "primereact/toast";

export const InputEnterPassword = ({
  inputModalVisible = false,
  handleCloseModalPassword,
}) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const  { toastRef, showToast } = useToast();



  const redirectMenu = () => {
    showToast("success", "Inicio Exitoso", "Redirigiendo al menu...");
    setTimeout(() => {
      handleCloseModalPassword(false);
      navigate("/menu");
    }, 1000);
  }

  return (
    <Dialog
      header="Enter Password"
      visible={inputModalVisible}
      style={{ width: "50vw" }}
      onHide={() => handleCloseModalPassword(false)}
    >
      <div className="flex flex-col space-y-4">
      <Toast ref={toastRef} />
        <input
          type="password"
          placeholder="Enter your password"
          className="border border-gray-200 rounded-lg p-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white rounded-full px-4 py-2"
          onClick={redirectMenu}
        >
          Enter
        </button>
      </div>
    </Dialog>
  );
};
