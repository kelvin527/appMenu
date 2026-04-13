# 🍕 Calculadora de Propina y Consumo

Aplicación web para gestionar pedidos de restaurante, calcular consumo acumulado y aplicar propinas de forma dinámica. Desarrollada con **React 19 + TypeScript + Tailwind CSS v4**, con foco en arquitectura limpia, separación de responsabilidades y rendimiento.

> **Nota para reclutadores:** Este proyecto fue construido con intención de aplicar patrones modernos de React. Cada decisión técnica está documentada en la sección [Decisiones de Diseño](#-decisiones-de-diseño).

---

## 📋 Tabla de Contenidos

- [Demo](#-demo)
- [Características](#-características)
- [Tecnologías y justificación](#️-tecnologías-y-justificación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso](#-instalación-y-uso)
- [Arquitectura](#-arquitectura)
- [Decisiones de Diseño](#-decisiones-de-diseño)
- [Componentes](#-componentes)
- [Interfaces y Tipos](#-interfaces-y-tipos)
- [Mejoras Futuras](#-mejoras-futuras)
- [Scripts Disponibles](#-scripts-disponibles)

---

## 🚀 Demo

La aplicación permite:

1. Seleccionar ítems del menú — si el ítem ya está en el pedido, incrementa su cantidad automáticamente.
2. Visualizar el consumo acumulado con precio por ítem y cantidad.
3. Elegir el porcentaje de propina (10 %, 20 % o 50 %).
4. Ver el subtotal y el total final actualizándose en tiempo real.
5. Limpiar la orden completa para comenzar de nuevo.

---

## ✨ Características

- **Gestión de pedidos inteligente** — Al agregar un ítem ya existente, se incrementa su `quantity` en lugar de duplicar la entrada en el array.
- **Eliminación de ítems** — Elimina cualquier ítem de la orden desde el panel de consumo.
- **Cálculo reactivo** — El subtotal y total se recalculan solo cuando cambian sus dependencias, gracias a `useMemo`.
- **Interfaz responsiva** — Layout de dos columnas en escritorio, columna única en móvil, con Tailwind CSS v4.
- **Reset completo** — Restablece pedido y propina a estado inicial en un solo paso.
- **Renderizado condicional** — El panel de consumo solo aparece cuando hay ítems en el pedido, evitando UI vacía.

---

## 🛠️ Tecnologías y justificación

| Tecnología | Versión | Por qué se eligió |
|---|---|---|
| **React** | ^19.2.4 | Modelo de componentes declarativo; la última versión estable incluye mejoras en el compilador |
| **TypeScript** | ~6.0.2 | Tipado estático que previene errores en tiempo de desarrollo y sirve como documentación viva de los contratos entre componentes |
| **Vite** | ^8.0.4 | Build tool extremadamente rápido con HMR nativo; reemplaza CRA con mejor DX y tiempos de compilación |
| **Tailwind CSS** | ^4.2.2 | Estilos utilitarios que eliminan el cambio de contexto entre archivos CSS y JSX; v4 usa un pipeline basado en Vite |
| **React Compiler** | ^1.0.0 | Optimización automática de renders: el compilador infiere memorizaciones sin necesidad de `useCallback` o `React.memo` manual, reduciendo boilerplate y errores humanos |

---

## 📁 Estructura del Proyecto

```
menu/
├── src/
│   ├── compoments/           # Componentes de presentación (UI pura)
│   │   ├── Consumo.tsx       # Lista de ítems en el pedido actual
│   │   ├── MenuItem.tsx      # Botón individual de ítem del menú
│   │   ├── Propina.tsx       # Selector de porcentaje de propina
│   │   ├── SubTotal.tsx      # Cálculo y display del subtotal
│   │   └── Total.tsx         # Total final + acciones (pagar/limpiar)
│   ├── db/
│   │   └── date.ts           # Fuente de datos estática del menú
│   ├── hooks/
│   │   └── useOrder.ts       # Custom Hook: toda la lógica de negocio
│   ├── interfaces/
│   │   └── menuItem.ts       # Contratos TypeScript
│   ├── App.tsx               # Componente raíz y punto de composición
│   └── main.tsx              # Entry point
├── index.html
└── vite.config.ts
```

La separación entre `compoments/` (UI) y `hooks/` (lógica) es intencional y refleja el principio de **separación de responsabilidades**.

---

## ⚙️ Instalación y Uso

### Prerequisitos

- **Node.js** `>= 20.19.0`
- **npm**

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd menu

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Disponible en `http://localhost:5173`.

---

## 🏗️ Arquitectura

### Patrón: Custom Hook como capa de lógica

Toda la lógica de negocio está encapsulada en `useOrder`. Los componentes son **funciones puras de presentación** que reciben props y llaman callbacks — no saben nada sobre cómo se gestiona el estado.

```
App.tsx  ←  consume useOrder() y distribuye props
 │
 ├── MenuItem       → recibe: item, addItemToOrder
 ├── Consumo        → recibe: order[], removeItemFromOrder
 ├── SubTotal       → recibe: order[]
 ├── Propina        → recibe: setTip
 └── Total          → recibe: order[], tip, limpiarOrden
```

Este diseño tiene ventajas concretas:
- Los componentes son **fácilmente testeables** de forma aislada.
- La lógica del pedido puede reutilizarse en otro contexto (ej: un modal, una pantalla diferente) sin cambiar los componentes.
- Un cambio en la lógica de negocio (ej: descuentos, impuestos) solo toca `useOrder.ts`.

### Flujo de datos (unidireccional)

```
Clic en MenuItem
      │
      ▼
addItemToOrder(item)
      │
      ├── ¿item.id ya existe en order[]?
      │      ├── Sí → map() + quantity + 1     (inmutabilidad: nuevo array)
      │      └── No → spread + nuevo objeto    (inmutabilidad: nuevo array)
      │
      ▼
setOrder(nuevoArray)
      │
      ▼
React re-renderiza los consumidores del estado (Consumo, SubTotal, Total)
```

---

## 💡 Decisiones de Diseño

### 1. Inmutabilidad del estado

Al actualizar una orden, nunca se muta el array directamente. Se generan nuevos arrays con `map()` o spread operator, respetando el modelo de React y evitando bugs de referencias:

```typescript
// ✅ Correcto — nuevo array, React detecta el cambio
const updatedOrder = order.map(orderItem =>
  orderItem.id === item.id
    ? { ...orderItem, quantity: orderItem.quantity + 1 }
    : orderItem
)
setOrder(updatedOrder)

// ❌ Incorrecto — mutación directa, React no detecta el cambio
order[index].quantity += 1
setOrder(order)
```

### 2. `useMemo` para cálculos derivados

`SubTotal` y `Total` usan `useMemo` porque su valor **se deriva del estado existente**. No es necesario guardarlo en un estado separado ni recalcularlo en cada render:

```typescript
// Solo se recalcula cuando `order` cambia, no en cada re-render del padre
const subTotal = useMemo(() =>
  order.reduce((sum, item) => sum + item.price * item.quantity, 0),
[order])
```

### 3. Elevación de estado (Lifting State Up)

El estado `order` y `tip` vive en `App` (a través de `useOrder`) porque **múltiples componentes lo necesitan**. Si viviera en un componente hijo, los hermanos no tendrían acceso sin prop drilling o contexto innecesario.

### 4. Renderizado condicional como mejora de UX

El panel de consumo (columna derecha) solo se renderiza cuando hay ítems en el pedido. Esto evita mostrar secciones vacías y mejora la percepción visual de la aplicación:

```tsx
{order.length > 0 && (
  <div className="flex flex-col space-y-4">
    <Consumo ... />
    <SubTotal ... />
    <Propina ... />
    <Total ... />
  </div>
)}
```

### 5. Extensión de interfaces con TypeScript

`IMenuItemFull` extiende `IMenuItem` en lugar de duplicar campos. Esto garantiza que si `IMenuItem` cambia, `IMenuItemFull` hereda automáticamente esos cambios:

```typescript
export interface IMenuItem {
  id: number
  name: string
  price: number
}

// Extiende para no duplicar — principio DRY
export interface IMenuItemFull extends IMenuItem {
  quantity: number
}
```

---

## 🧩 Componentes

### `<MenuItem />`
Botón de presentación puro. Recibe un ítem y un callback, no gestiona estado.

| Prop | Tipo | Descripción |
|---|---|---|
| `item` | `IMenuItem` | Datos del ítem (id, name, price) |
| `addItemToOrder` | `(item: IMenuItem) => void` | Callback para agregar al pedido |

### `<Consumo />`
Lista los ítems del pedido con cantidad, precio total por ítem y opción de eliminar.

| Prop | Tipo | Descripción |
|---|---|---|
| `order` | `IMenuItemFull[]` | Lista de ítems del pedido |
| `removeItemFromOrder` | `(id: number) => void` | Callback para eliminar un ítem |

### `<SubTotal />`
Valor derivado del pedido, memoizado. Componente de solo lectura.

| Prop | Tipo | Descripción |
|---|---|---|
| `order` | `IMenuItemFull[]` | Lista de ítems del pedido |

### `<Propina />`
Grupo de radio buttons con opciones predefinidas. Solo actualiza estado, no lo lee.

| Prop | Tipo | Descripción |
|---|---|---|
| `setTip` | `Dispatch<SetStateAction<number>>` | Setter del estado de propina |

### `<Total />`
Combina subtotal + propina para el total final. Punto de acción del usuario.

| Prop | Tipo | Descripción |
|---|---|---|
| `order` | `IMenuItemFull[]` | Lista de ítems del pedido |
| `tip` | `number` | Porcentaje de propina (ej: 0.10) |
| `limpiarOrden` | `() => void` | Callback para resetear la orden |

---

## 🔌 Interfaces y Tipos

```typescript
// src/interfaces/menuItem.ts

export interface IMenuItem {
  id: number
  name: string
  price: number
}

export interface IMenuItemFull extends IMenuItem {
  quantity: number
}
```

---

## 🔭 Mejoras Futuras

Estas son las mejoras que implementaría si el proyecto escalara o pasara a producción:

| Mejora | Justificación |
|---|---|
| **Tests con Vitest + Testing Library** | Testear `useOrder` de forma aislada y los componentes con eventos simulados |
| **Persistencia con `localStorage`** | Mantener el pedido si el usuario recarga la página accidentalmente |
| **Context API o Zustand** | Si los componentes crecen en profundidad, evitar prop drilling con un store global |
| **Integración con API REST** | Reemplazar `db/date.ts` con un fetch real a un backend; agregar estados de loading/error |
| **Categorías en el menú** | Filtrar ítems por categoría (entradas, principales, bebidas, postres) |
| **Historial de órdenes** | Registrar las órdenes pagadas para estadísticas o reimprimir |
| **Animaciones con Framer Motion** | Feedback visual al agregar/eliminar ítems del pedido |
| **i18n** | Soporte multilenguaje para el texto de la UI |

---

## 📜 Scripts Disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera el bundle de producción en `/dist` |
| `npm run preview` | Sirve localmente el bundle de producción para verificar antes de deploy |
| `npm run lint` | Ejecuta ESLint con reglas de TypeScript y React Hooks |

---

## 📄 Licencia

Este proyecto es de uso personal/educativo. Todos los derechos reservados.
