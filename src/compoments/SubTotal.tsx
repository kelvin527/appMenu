import { useMemo } from "react";
import type { IMenuItemFull } from "../interfaces/menuItem";

interface ConsumoTotalProps {
  order: IMenuItemFull[]
}

export default function SubTotal({ order }: ConsumoTotalProps) {
  const subTotal = useMemo(() => {
    return order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [order]);

 
  return (
    <div>
        <h2 className="text-2xl font-bold mb-1 ">Consumo Total</h2>
        <p className=" text-gray-500"> Sub Total a pagar:${subTotal.toFixed(2)} </p>
           
    </div>
  )
}
