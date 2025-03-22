import { IEvents } from '../base/events';
import { IActions, IProduct } from '../../types';

class ProductView {
	protected _element: HTMLElement
	protected _title: HTMLElement
	protected _price: HTMLElement

	constructor(protected template: HTMLTemplateElement, protected events: IEvents, protected actions?: IActions) {
		this._element = template.content.firstElementChild.cloneNode(true) as HTMLElement
		this._title = this._element.querySelector('.card__title')
		this._price = this._element.querySelector('.card__price')
	}

	protected setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно'
		}
		return `${value} синапсов`
	}

	render(data: IProduct): HTMLElement {
		this._title.textContent = data.title
		this._price.textContent = this.setPrice(data.price)
		return this._element
	}
}

interface ICard {
	displayCard(data: IProduct): HTMLElement
}

export class Card extends ProductView implements ICard {
	protected _cardImage: HTMLImageElement
	protected _cardCategory: HTMLElement
	protected _cardDescription = new Map<string, string>([
		["дополнительное", "additional"],
		["софт-скил", "soft"],
		["кнопка", "button"],
		["хард-скил", "hard"],
		["другое", "other"],
	])

	constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		super(template, events, actions)
		this._cardCategory = this._element.querySelector('.card__category')
		this._cardImage = this._element.querySelector('.card__image')

		if (this.actions?.onClick) {
			this._element.addEventListener('click', this.actions.onClick)
		}
	}

	private setCategory(value: string) {
		const categoryClass = this._cardDescription.get(value)
		if (categoryClass) {
			this._cardCategory.className = `card__category card__category_${categoryClass}`
		} else {
			console.warn(`Не найдено соответствие для категории: ${value}`)
			this._cardCategory.className = 'card__category'
		}
		this._cardCategory.textContent = value
	}

	displayCard(data: IProduct): HTMLElement {
		this.setCategory(data.category)
		this._cardImage.src = data.image
 		this._cardImage.alt = data.title
		return super.render(data)
	}
}

export class CardPreview extends Card {
	text: HTMLElement
	protected _button:HTMLButtonElement

	constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		super(template, events, actions)
		this.text = this._element.querySelector('.card__text')
		this._button = this._element.querySelector('.card__button')
		this._button.addEventListener('click', () => { this.events.emit('basket:itemAdd')})

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick)
		}
	}

	private notSale(data: IProduct, basketDuplicate: boolean): string {
		if (basketDuplicate) {
			this._button.setAttribute('disabled', '')
			return 'В корзине'
		} else if (data.price) {
			this._button.removeAttribute('disabled')
			return 'В корзину'
		} else {
			this._button.setAttribute('disabled', '')
			return 'Не продается'
		}
	}

	displayPreview(data: IProduct, basketDuplicate:boolean): HTMLElement {
		super.displayCard(data)
		this.text.textContent = data.description;
		(this._button).textContent = this.notSale(data, basketDuplicate)
		return this._element
	}
}

export class BasketItem extends ProductView {
	index: HTMLElement
	protected _button: HTMLButtonElement

	constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		super(template, events, actions)
		this.index = this._element.querySelector('.basket__item-index')
		this._button = this._element.querySelector('.basket__item-delete')

		if (this.actions?.onClick) {
			this._button.addEventListener('click', this.actions.onClick)
		}
	}

	displayBasketItem(data: IProduct, item: number): HTMLElement {
		this.index.textContent = `${item}`
		return super.render(data)
	}
}