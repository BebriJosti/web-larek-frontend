import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export interface ICardsModel {
	productCards: IProduct[]
	clickedCard: IProduct | null
	setPreview(item: IProduct): void
}

export class CardsModel implements ICardsModel {
	private _productCards: IProduct[] = []
	clickedCard: IProduct | null = null

	constructor(protected events: IEvents) {}

	get productCards(): IProduct[] {
		return this._productCards
	}

	set productCards(arr: IProduct[]) {
		this._productCards = arr
		this.events.emit('products:changed', this._productCards)
	}

	setPreview(item: IProduct) {
		this.clickedCard = item
		this.events.emit('modalCard:open', item)
	}
}

