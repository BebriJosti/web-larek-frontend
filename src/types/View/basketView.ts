import { IEvents } from '../../components/base/events';
import { createElement } from '../../utils/utils';

interface IBasket {
	basket: HTMLElement
	basketTitle: HTMLElement
	basketList: HTMLElement
	basketButton: HTMLButtonElement
	basketPrice: HTMLElement
	displayBasket():HTMLElement
	displayBasketCount(value: number): void
	displayBasketSum(sum: number): void
	basketHeaderCounter: HTMLElement
	basketHeaderButton: HTMLButtonElement
}

export class Basket implements IBasket {
	basket: HTMLElement
	basketTitle: HTMLElement
	basketList: HTMLElement
	basketButton: HTMLButtonElement
	basketPrice: HTMLElement
	basketHeaderCounter: HTMLElement
	basketHeaderButton: HTMLButtonElement

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.basket = template.content.querySelector(".basket").cloneNode(true) as HTMLElement
		this.basketTitle = this.basket.querySelector(".modal__title")
		this.basketList = this.basket.querySelector(".basket__list")
		this.basketPrice = this.basket.querySelector('.basket__price')
		this.basketButton = this.basket.querySelector(".basket__button")
		this.basketHeaderCounter = document.querySelector(".header__basket-counter")
		this.basketHeaderButton = document.querySelector(".header__basket")

		this.basketButton.addEventListener('click', () => {
			this.events.emit('order:open') })
		this.basketHeaderButton.addEventListener('click', () => {
			this.events.emit('basket:open') })

		this.basketItems = []

	}

	set basketItems(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items)
			this.basketButton.removeAttribute('disabled')
		} else {
			this.basketButton.setAttribute('disabled', '')
			this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста'
			}))
		}
	}

	displayBasketCount(value: number) {
		this.basketHeaderCounter.textContent = `${value}`
	}

	displayBasketSum(sum: number) {
		this.basketPrice.textContent = `${sum} синапсов`
	}

	displayBasket() {
		this.basketTitle.textContent = 'Корзина'
		return this.basket
	}
}


