import React from "react";

export const Header = () => {
  return (
    <div className="w-full h-20 bg-white flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">FELIPE SHOP</h1>
      </div>
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Usuario</h1>
        <img
          src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png"
          alt="user"
          className="w-12 h-12 rounded-full"
        />
      </div>
    </div>
  );
};
