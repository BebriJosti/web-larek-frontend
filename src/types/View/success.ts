import { IEvents } from '../../components/base/events';

interface ISuccess {
	success: HTMLElement
	successText: HTMLElement
	button: HTMLButtonElement
	displaySuccess(total: number): HTMLElement
}

export class Success implements ISuccess{
	success: HTMLElement
	successText: HTMLElement
	button: HTMLButtonElement

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.success = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement
		this.successText = this.success.querySelector('.order-success__description')
		this.button = this.success.querySelector('.order-success__close')

		this.button.addEventListener('click', () => { events.emit('success:close') })
	}

	displaySuccess(total: number) {
		if (this.successText) {
			this.successText.textContent = `Списано ${total} синапсов`
		}
		return this.success
	}
}