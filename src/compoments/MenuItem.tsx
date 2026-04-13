import type { IMenuItem, } from "../interfaces/menuItem"

interface MenuItemProps {
  item: IMenuItem,
  addItemToOrder: (order: IMenuItem) => void
}

export default function MenuItem({item, addItemToOrder}: MenuItemProps) {
  return (
   <button className="w-full hover:bg-teal-200 text-center py-3 px-5
    bg-gray-100 rounded-lg mb-2" onClick={() => addItemToOrder(item)}>
    <h3 className="text-lg font-semibold">{item.name}</h3>
    <span className="text-sm font-bold">${item.price.toFixed(2)}</span>
    
   </button>

   
  )
}
