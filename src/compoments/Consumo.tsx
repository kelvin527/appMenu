import type { IMenuItemFull } from "../interfaces/menuItem"

interface ConsumoProps {
  order: IMenuItemFull[],
    removeItemFromOrder: (id: IMenuItemFull['id']) => void
}

export default function Consumo({ order, removeItemFromOrder }: ConsumoProps) {
  return (
<>
   <div>
     <h2 className="text-2xl font-bold mb-4 text-center">Consumo</h2>
    {order.length === 0 ? (
      <p className="text-center text-gray-500">No tienes items en el pedido</p>
    ) : (
        <ul className="flex flex-col gap-2">
          {order.map((item) => (
            <li key={item.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <div className="flex flex-col">
                <span>{item.name}</span>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded-md
                 hover:bg-red-600 flex items-center justify-center"
                onClick={() => removeItemFromOrder(item.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}
   </div>

   


</> 
 )
}
