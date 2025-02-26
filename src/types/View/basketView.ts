import { IEvents } from '../../components/base/events';
import { createElement } from '../../utils/utils';

interface IBasket {
	basket: HTMLElement
	basketTitle: HTMLElement
	basketList: HTMLElement
	basketButton: HTMLButtonElement
	basketPrice: HTMLElement
	displayBasket(items: HTMLElement[]):HTMLElement
	displayBasketSum(sum: number): void
}

export class Basket implements IBasket {
	basket: HTMLElement
	basketTitle: HTMLElement
	basketList: HTMLElement
	basketButton: HTMLButtonElement
	basketPrice: HTMLElement

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.basket = template.content.querySelector(".basket").cloneNode(true) as HTMLElement
		this.basketTitle = this.basket.querySelector(".modal__title")
		this.basketList = this.basket.querySelector(".basket__list")
		this.basketPrice = this.basket.querySelector('.basket__price')
		this.basketButton = this.basket.querySelector(".basket__button")

		this.basketButton.addEventListener('click', () => {
			this.events.emit('order:open')
		})
	}

	displayBasket(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items)
			this.basketButton.removeAttribute('disabled')
		} else {
			this.basketButton.setAttribute('disabled', '')
			this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста'
			}))
		}
		this.basketTitle.textContent = 'Корзина'
		return this.basket
	}

	displayBasketSum(sum: number) {
		this.basketPrice.textContent = `${sum} синапсов`
	}
}