import React, { useEffect, useState } from "react";
import { BiCart } from "react-icons/bi";
import { MdOutlineInventory } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiRefund2Fill } from "react-icons/ri";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LiaClipboardListSolid } from "react-icons/lia";
import { TbReportMoney } from "react-icons/tb";
import { TbPigMoney } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { Link } from "react-router-dom";
export const Menu = () => {
  return (
    <div className="w-full h-full grid grid-cols-6 gap-2 bg-white p-2">
      {/* Menu tipo windows 8, manejo de inventarios */}
      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <AiOutlineUser size={120} />
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">USUARIOS</h3>  
      </div>

      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <MdOutlineInventory size={120} />
      <Link
        to="/inventory"
        className="absolute top-0 right-0 bottom-0 left-0"
      >
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">INVENTARIO</h3>  
      </Link>
      </div>

      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <BiCart size={120}/>
      <Link
        to="/sell"
        className="absolute top-0 right-0 bottom-0 left-0"
      >
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">VENTAS</h3>  
      </Link>
      </div>
      
      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <TbReportMoney size={120}/>
      <Link
        to="/sales"
        className="absolute top-0 right-0 bottom-0 left-0"
      >
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">VENTAS</h3>  
      </Link>
      </div>
      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <HiOutlineUserGroup size={120}/>
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">NOMINA</h3>  
      </div>
      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <RiRefund2Fill size={120} />
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">DEVOLUCIONES</h3>  
      </div>
      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <HiOutlineDocumentReport size={120} />
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">REPORTES</h3>  
      </div>
      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <GiPayMoney size={120} />
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">CXP</h3>  
      </div>
      <div className="col-span-2 bg-gray-200 flex flex-col items-center justify-center relative rounded-lg">
      <GiReceiveMoney size={120} />
        <h3 className="absolute bottom-0 left-3 text-lg font-sans font-bold">CXC</h3>  
      </div>
    </div>
  )
}