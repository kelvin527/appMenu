import { useState } from "react"
import type { IMenuItem, IMenuItemFull } from "../interfaces/menuItem"



export default function useOrder() {

    const[order, setOrder] = useState<IMenuItemFull[]>([])
    const[tip, setTip] = useState<number>(0)

    function addItemToOrder(item:IMenuItem) {
        const existingItemIndex = order.find(orderItem => orderItem.id === item.id)
        if(existingItemIndex) {
            // Update quantity of existing item
            const updatedOrder = order.map(orderItem => orderItem.id === item.id ? 
                { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem)
            setOrder(updatedOrder)
        } else {
            // Add new item to order
            const newOrderItem: IMenuItemFull = { ...item, quantity: 1 }
            setOrder([...order, newOrderItem]);
        }
    }

    const removeItemFromOrder = (id: IMenuItem['id']) => {
        const updatedOrder = order.filter(orderItem => orderItem.id !== id)
        setOrder(updatedOrder)
    }

    const limpiarOrden = () => {
        setOrder([])
        setTip(0)
    }

  return {
    addItemToOrder,
    order,
    removeItemFromOrder,
    limpiarOrden,
    tip,
    setTip
  }
}
