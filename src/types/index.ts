interface IProductList {
	total:number
	items?:Array<IProduct>
}

interface IProduct {
	id: string
	description: string
	image: string
	title: string
	category: string,
	price: number | null
}

interface IOrderForm {
	payment: string
	address: string
	email: string
	phone: number | string
	total:number
}

interface IOrderResult {
	id:string
	total:number
}

interface IError {
	error:string
}