export interface IMenuItem {
    id: number,
    name: string,
    price: number
}

export interface IMenuItemFull extends IMenuItem {
    quantity: number,
}