import { IEvents } from '../../components/base/events';
import { IActions, IProduct } from '../index';

interface ICard {
	displayCard(data: IProduct): HTMLElement
	setPrice(value: number | null): string
	setCategory(value: string): void

	basketHeaderCounter: HTMLElement
	basketHeaderButton: HTMLButtonElement
	displayBasketCount(value: number): void
}

export class Card implements ICard {
	protected _cardElement: HTMLElement
	protected _cardCategory: HTMLElement
	protected _cardTitle: HTMLElement
	protected _cardImage: HTMLImageElement
	protected _cardPrice: HTMLElement

	basketHeaderCounter: HTMLElement
	basketHeaderButton: HTMLButtonElement

	protected _cardDescription = new Map<string, string>([
		["дополнительное", "additional"],
		["софт-скил", "soft"],
		["кнопка", "button"],
		["хард-скил", "hard"],
		["другое", "other"],
	])

	constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement
		this._cardCategory = this._cardElement.querySelector('.card__category')
		this._cardTitle = this._cardElement.querySelector('.card__title')
		this._cardImage = this._cardElement.querySelector('.card__image')
		this._cardPrice = this._cardElement.querySelector('.card__price')

		this.basketHeaderCounter = document.querySelector(".header__basket-counter")
		this.basketHeaderButton = document.querySelector(".header__basket")
		this.basketHeaderButton.addEventListener('click', () => {
			this.events.emit('basket:open') })

		if (actions?.onClick) {
			this._cardElement.addEventListener('click', actions.onClick)
		}
	}

	displayBasketCount(value: number) {
		this.basketHeaderCounter.textContent = `${value}`
	}


	setCategory(value: string) {
		const categoryClass = this._cardDescription.get(value)
		if (categoryClass) {
			this._cardCategory.className = `card__category card__category_${categoryClass}`
		} else {
			console.warn(`Не найдено соответствие для категории: ${value}`)
			this._cardCategory.className = 'card__category'
		}
		this._cardCategory.textContent = value
	}


	setPrice(value: number | null) {
		if (value === null) {
			return 'Бесценно';
		}
		return `${value} синапсов`;
	}

	displayCard(data: IProduct): HTMLElement {
		this.setCategory(data.category)
		this._cardTitle.textContent = data.title
		this._cardImage.src = data.image
		this._cardImage.alt = data.title
		this._cardPrice.textContent = this.setPrice(data.price)
		return this._cardElement
	}

}

export class CardPreview extends Card implements ICard {
	text: HTMLElement
	button: HTMLElement

	constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		super(template, events, actions)
		this.text = this._cardElement.querySelector('.card__text')
		this.button = this._cardElement.querySelector('.card__button')
		this.button.addEventListener('click', () => { this.events.emit('basket:add')})

	}

	notSale(data:IProduct) {
		if(data.price) {
			return 'В корзину'
		} else {
			this.button.setAttribute('disabled', 'true')
			return 'Не продается'
		}
	}

	displayPreview(data: IProduct): HTMLElement {
		super.displayCard(data);
		this.text.textContent = data.description;
		this.button.textContent = this.notSale(data);
		return this._cardElement;
	}
}