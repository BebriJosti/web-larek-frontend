import { IProduct } from '../../types';
import { IEvents } from '../base/events';

interface IBasketModel {
	basketItems: IProduct[]
	addProductToBasket(data: IProduct): void
	removeProductToBasket(item: IProduct): void
	clearBasket(): void
	basketCounter(): number
	totalPriceProducts(): number
}

export class BasketModel implements IBasketModel {
	protected _basketItems: IProduct[] = []

	constructor(protected events: IEvents) {}

	get basketItems() {
		return this._basketItems
	}

	set basketItems(arr: IProduct[]) {
		this._basketItems = arr
		this.events.emit('basket:changed', this._basketItems)
	}

	addProductToBasket(data: IProduct) {
		const basketDuplicate = this._basketItems.some(item => item.id === data.id);
		if (!basketDuplicate) {
		this._basketItems = [...this._basketItems, data]
		this.events.emit('basket:changed', this._basketItems)
	}}

	removeProductToBasket(item: IProduct) {
		const index = this._basketItems.findIndex(product => product.id === item.id)
		if (index >= 0) {
			this._basketItems.splice(index, 1)
			this.events.emit('basket:changed', this._basketItems)
		}
	}

	basketCounter() {
		return this.basketItems.length
	}

	totalPriceProducts() {
		return this.basketItems.reduce((sum, item) => {
			return sum + (item.price ?? 0)
		}, 0)
	}

	clearBasket() {
		this._basketItems = []
		this.events.emit('basket:changed', this._basketItems)
	}
}