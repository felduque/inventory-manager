import React, { useEffect, useState } from "react";
import { useCardItem } from "../../page/Sell/Sell";

export const CardSellProduct = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { inCardItem, setInCardItem } = useCardItem();

  const handleAddProduct = () => {
    // si el producto ya esta en el carrito, lo editamos
    if (inCardItem.find((item) => item._id === product._id)) {
      let newObject = inCardItem.map((item) => {
        if (item._id === product._id) {
          item.quantity = quantity;
        }
        return item;
      });
      setInCardItem(newObject);
      return;
    } else {
      let newObject = {
        ...product,
        iva: true,
        quantity,
      };
      setInCardItem([...inCardItem, newObject]);
    }
  };

  useEffect(() => {
    if(inCardItem.find((item) => item._id === product._id)){
      setQuantity(inCardItem.find((item) => item._id === product._id).quantity)
    }
  }
  , [
    inCardItem
  ]);

  return (
    <div className={`w-full h-52 bg-white shadow-shPrimary rounded-lg flex flex-col items-center justify-center gap-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-2 ${inCardItem.find((item) => item._id === product._id) && "border-2 border-yellow-400" }`}>
      <div className="flex flex-col  items-start w-full h-2/3 rounded-t-lg">
        {/* aqui va la imagen de producto, titulo */}
        <img
          className="h-3/4 w-full rounded-t-lg object-cover"
          src="https://i.ibb.co/F8jpYFz/descarga.jpg"
          alt="Producto"
        />
        {/* titulo */}
        <div className="w-full h-1/4 flex justify-center items-center">
          <p className="text-sm font-bold pl-1">{product.description}</p>
        </div>
      </div>
      <div className="flex justify-between pl-2 pr-2 items-center gap-2 w-full h-1/3 md:pl-1 md:pr-1 md:gap-1 md:items-center md:w-full md:h-1/3 lg:pl-2 lg:pr-2 lg:gap-2 lg:w-full lg:h-1/3 xl:pl-2 xl:pr-2 xl:gap-2 xl:w-full xl:h-1/3">
        {/* Precio, agregar unidades y restar unidades */}
        <button
          className="w-6 h-6 bg-red-400 rounded-full flex justify-center items-center"
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity === 1}
        >
          -
        </button>
        <p className="text-sm font-bold">{quantity}</p>
        <button
          className="w-6 h-6 bg-green-400 rounded-full flex justify-center items-center"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
        {/* Agregar  */}
        <button
          className={`w-1/2 h-8 bg-green-400 rounded-md text-white font-bold ${
            inCardItem.find((item) => item._id === product._id)
              ? "bg-yellow-400"
              : ""
          } md:w-1/2 md:h-8 md:rounded-md md:text-white md:font-bold md:${
            inCardItem.find((item) => item._id === product._id)
              ? "bg-yellow-400"
              : ""
          } lg:w-1/2 lg:h-8 lg:rounded-md lg:text-white lg:font-bold lg:${
            inCardItem.find((item) => item._id === product._id)
              ? "bg-yellow-400"
              : ""
          } xl:w-1/2 xl:h-8 xl:rounded-md xl:text-white xl:font-bold xl:${
            inCardItem.find((item) => item._id === product._id)
              ? "bg-yellow-400"
              : ""
          }`}
          onClick={handleAddProduct}
        >
          {/* si el producto existe en InCardItem lo ponemos editar */}
          {inCardItem.find((item) => item._id === product._id)
            ? "Editar"
            : "Agregar"}
        </button>
      </div>
    </div>
  );
};
