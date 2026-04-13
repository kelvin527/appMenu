import {  useMemo } from "react";
import type { IMenuItemFull } from "../interfaces/menuItem";

interface TotalProps {
    order: IMenuItemFull[],
    tip: number,
    limpiarOrden: () => void


}

export default function Total({ order, tip, limpiarOrden  }: TotalProps) {
    const subTotal = useMemo(() => {
        return order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }, [order]);

      const total = useMemo(() => {
        return subTotal + (subTotal * tip);
      }, [subTotal, tip]);
    
  return (
    <div>
        <h2 className="text-2xl font-bold mb-1 ">Total de la orden</h2>
        <p className=" text-gray-500"> Total a pagar: ${total.toFixed(2)} </p>

     <div className="flex flex-justify-between gap-2">
           <button className="mt-4 w-full bg-teal-400
         hover:bg-teal-200 font-bold py-2 px-4 rounded">
            Pagar
        </button>
           <button className="mt-4 w-full bg-red-500
         hover:bg-red-600 font-bold text-white py-2 px-4 rounded"
         onClick={limpiarOrden}
         >
            Limpiar Orden
        </button>
     </div>
    </div>
    
  )
}
