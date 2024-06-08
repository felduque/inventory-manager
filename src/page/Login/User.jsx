import { React, useState } from "react";
import { InputEnterPassword } from "./InputEnterPassword/InputEnterPassword";

export const User = () => {
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const handleCloseModalPassword = (value) => {
    setInputModalVisible(value);
  }
  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 shadow-xl rounded-lg h-fit">
      <InputEnterPassword
        inputModalVisible={inputModalVisible}
        handleCloseModalPassword={handleCloseModalPassword}
      />
      <div className="inline-flex shadow-lg border border-gray-200 rounded-full overflow-hidden h-16 w-16">
        <img
          src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png"
          alt=""
          className="w-16 h-16 rounded-full"
        />
      </div>
      <h2 className="mt-4 font-bold text-xl">Felipe Duque</h2>
      <h6 className="mt-2 text-sm font-medium">Administrador</h6>
      <ul className="flex flex-row mt-4 space-x-2">
        <li>
          <button
            className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs"
            onClick={() => setInputModalVisible(true)}
          >
            Iniciar
          </button>
        </li>
        <li>
          <button className="text-gray-950 border border-red-700 bg-red-400 rounded-full px-2 py-1 text-xs">
            Eliminar
          </button>
        </li>
      </ul>
    </div>
  );
};
