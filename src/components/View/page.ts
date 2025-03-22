import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IPage {
	displayBasketCount(value: number): void
}

export class Page implements IPage {
	basketHeaderButton: HTMLButtonElement
	basketHeaderCounter: HTMLElement
	catalog: HTMLElement

	constructor(protected events: IEvents) {
		this.basketHeaderCounter = ensureElement(".header__basket-counter")
		this.basketHeaderButton = ensureElement (".header__basket") as HTMLButtonElement
		this.catalog = ensureElement('.gallery')
		this.basketHeaderButton.addEventListener('click', () => {
			this.events.emit('basket:open')
		})
	}

	displayBasketCount(value: number) {
		this.basketHeaderCounter.textContent = `${value}`
	}
}