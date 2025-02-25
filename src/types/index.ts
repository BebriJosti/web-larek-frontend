export interface IProduct {
	id: string
	description: string
	image: string
	title: string
	category: string,
	price: number | null
}

export interface IOrderForm {
	payment: string
	address: string
	email: string
	phone: number | string
}

export interface IOrderResult {
	id:string
	total:number
}

export interface IActions {
	 onClick: (event: MouseEvent) => void;
 }