import { IActions, IProduct } from '../index';
import { IEvents } from '../../components/base/events';

export interface IBasketItem {
	basketItem: HTMLElement
	index:HTMLElement
	title: HTMLElement
	price: HTMLElement
	buttonDelete: HTMLButtonElement;
	displayBasketItem(data: IProduct, item: number): HTMLElement
}

export class BasketItem implements IBasketItem {
	basketItem: HTMLElement
	index:HTMLElement
	title: HTMLElement
	price: HTMLElement
	buttonDelete: HTMLButtonElement

	constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement
		this.index = this.basketItem.querySelector('.basket__item-index')
		this.title = this.basketItem.querySelector('.card__title')
		this.price = this.basketItem.querySelector('.card__price')
		this.buttonDelete = this.basketItem.querySelector('.basket__item-delete')

		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick)
		}
	}

	protected setPrice(value: number | null) {
		if (value === null) {
			return 'Бесценно'
		}
		return `${value} синапсов`
	}

	displayBasketItem(data: IProduct, item: number) {
		this.index.textContent = `${item}`
		this.title.textContent = data.title
		this.price.textContent = this.setPrice(data.price)
		return this.basketItem
	}
}