import { IEvents } from '../base/events';

interface IOrder {
	displayOrder(): HTMLElement
	setPaymentChoice(paymentMethod: string): void
	setValid(value: boolean): void
	setFormErrors(errors: string): void
}

export class Order implements IOrder {
	orderForm: HTMLFormElement
	orderButtons: HTMLButtonElement[]
	buttonSubmit: HTMLButtonElement
	formErrors: HTMLElement
	orderInput:HTMLInputElement

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.orderForm = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement
		this.orderButtons = Array.from(this.orderForm.querySelectorAll('.button_alt'))
		this.buttonSubmit = this.orderForm.querySelector('.order__button')
		this.formErrors = this.orderForm.querySelector('.form__errors')
		this.orderInput = this.orderForm.querySelector('.form__input')

		this.orderButtons.forEach(item => {
			item.addEventListener('click', () => {
				this.events.emit('orderPayment:request', {payment: item.name})
			})
		})

		this.orderInput.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement
			const field = target.name
			const value = target.value
			this.events.emit('orderAddress:request', { field, value })
		})

		this.orderForm.addEventListener('submit', (evt: Event) => {
			evt.preventDefault()
			this.events.emit('contacts:open')
		})
	}

	setPaymentChoice(paymentMethod: string) {
		this.orderButtons.forEach(item => {
			item.classList.toggle('button_alt-active', item.name === paymentMethod)
		})
	}

	setValid(value: boolean) {
		this.buttonSubmit.disabled = !value
	}

	setFormErrors(errors: string) {
		this.formErrors.textContent = errors
	}

	clearOrder() {
		this.orderInput.value = ''
		this.orderButtons.forEach(button => {
			button.classList.remove('button_alt-active')
		})
	}
	displayOrder() {
		return this.orderForm;
	}
}