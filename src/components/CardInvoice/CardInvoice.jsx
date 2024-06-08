import React from "react";
import { useCardItem } from "../../page/Sell/Sell";
import { TbTrash } from "react-icons/tb";

export const CardInvoice = ({ product }) => {
  const { inCardItem, setInCardItem } = useCardItem();
  const handleDeleteProduct = () => {
    let newObject = inCardItem.filter((item) => item._id !== product._id);
    setInCardItem(newObject);
  };

  const handleChangeIva = () => {
    let newObject = inCardItem.map((item) => {
      if (item._id === product._id) {
        item.iva = !item.iva;
      }
      return item;
    });
    setInCardItem(newObject);
  };

  return (
    <div className="w-full h-28 bg-white shadow-shPrimary rounded-lg flex items-center justify-center gap-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-2 relative">
      <button
        onClick={handleDeleteProduct}
        className="absolute top-0 right-0 w-6 h-6 bg-red-400 rounded-full flex justify-center items-center"
      >
        <TbTrash />
      </button>
      <img
        className="h-full w-1/3 rounded-t-lg object-cover"
        src="https://i.ibb.co/F8jpYFz/descarga.jpg"
        alt="Producto"
      />
      <div className="flex flex-col  items-start w-2/3 h-full justify-between pt-1 pb-1">
        {/* Titulo, cantidad y precio */}
        <div className="flex flex-col gap-1 w-full pr-10 overflow-hidden">
          <p className="text-sm font-bold pl-1 truncate">
            {product.description}
          </p>
          <p className="text-gray-400 text-sm pl-1 font-semibold">
            {product.quantity}X
          </p>
        </div>
        <div
          className="flex justify-between items-center gap-2 w-full pr-2"
        >
          <p className="text-gray-400 text-sm pl-1 font-semibold">
            IVA incluido
          </p>
          <input
            id="iva"
            type="checkbox"
            className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
            checked={product.iva}
            onChange={handleChangeIva}
          />
        </div>

        <p className="font-medium text-gray-800 text-lg">
          <span className="font-semibold text-sm text-gray-400">$</span>
          {/* Como el iva ya viene incluido si es false se resta el 0.19 */}
          {(product.sellingPrice * product.quantity * (product.iva ? 1 : 0.81)).toLocaleString("es-CO")}
        </p>
      </div>
    </div>
  );
};
