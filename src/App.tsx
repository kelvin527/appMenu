import Consumo from "./compoments/Consumo"
import SubTotal from "./compoments/SubTotal"
import MenuItem from "./compoments/MenuItem"
import Propina from "./compoments/Propina"
import Total from "./compoments/Total"
import { menuItems } from "./db/date"
import useOrder from "./hooks/useOrder"

function App() {

const {addItemToOrder, order, removeItemFromOrder, tip, setTip, limpiarOrden} = useOrder()

  return (
    <>
      <header className="bg-teal-400  py-5">
      <h1 className="text-4xl text-center font-black">
        Calculadora de Propina y Consumo
        </h1>
      </header>

      <main className=" max-w-7xl mx-auto py-20 md:grid grid-cols-2 space-x-2">
        <div>
        <h2 className="text-2xl font-bold mb-4 text-center">Menú</h2>
        {menuItems.map((item) => (
        <MenuItem
         key={item.id} 
         item={item}
         addItemToOrder={addItemToOrder}
         />
          
        ))}
        
        </div>
       {order.length > 0 && ( <div className="flex flex-col space-y-4">
          <Consumo 
          order={order}
          removeItemFromOrder={removeItemFromOrder}
          />
          
          <SubTotal 
            order={order}
          />
          <Propina 
            setTip={setTip}
          />

            <Total
            order={order}
            tip={tip}
            limpiarOrden={limpiarOrden}
            />
        </div> )}
      </main>
    </>
  )
}

export default App
