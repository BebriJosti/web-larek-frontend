import { IProduct } from '../index';

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

	get basketItems() {
		return this._basketItems
	}

	set basketItems(arr: IProduct[]) {
		this._basketItems = arr
	}

	addProductToBasket(data: IProduct) {
		this._basketItems = [...this._basketItems, data];
	}

	removeProductToBasket(item: IProduct) {
		const index = this._basketItems.findIndex(product => product.id === item.id)
		if (index >= 0) {
			this._basketItems.splice(index, 1)
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
	}
}