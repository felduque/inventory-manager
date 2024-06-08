import { React } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SwitchUser } from "../page/Login/SwitchUser";
import { Header } from "../components/Header/Header";
import { Menu } from "../page/Menu/Menu";
import { Inventory } from "../page/Inventory/Inventory";
import { Sell } from "../page/Sell/Sell";
import { Sales } from "../page/Sales";

export const Navigation = () => {
  return (
    <BrowserRouter>
      <NavigationInner />
    </BrowserRouter>
  );
};

const NavigationInner = () => {
  const location = useLocation();

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 gap-2">
      {location.pathname !== '/' && <Header />}
      <div className={`w-full ${location.pathname !== '/' && 'h-[calc(100%-5rem)]'}  bg-white flex flex-col items-center justify-center`}>
        <Routes>
          <Route path="/" element={<SwitchUser />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </div>
    </div>
  );
};