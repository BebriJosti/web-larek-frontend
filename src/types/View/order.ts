import { IEvents } from '../../components/base/events';

interface IOrder  {
	 orderForm: HTMLFormElement
	 orderButtons: HTMLButtonElement[]
	 displayOrder(): HTMLElement
	 paymentChoice:string
}

export class Order implements IOrder {
	orderForm: HTMLFormElement;
	orderButtons: HTMLButtonElement[]
	buttonSubmit: HTMLButtonElement
	formErrors: HTMLElement
	private _paymentChoice: string | null = null

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.orderForm = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement
		this.orderButtons = Array.from(this.orderForm.querySelectorAll('.button_alt'))
		this.buttonSubmit = this.orderForm.querySelector('.order__button')
		this.formErrors = this.orderForm.querySelector('.form__errors')

		this.orderButtons.forEach(item => {
			item.addEventListener('click', () => {
				this.paymentChoice = item.name
				events.emit('order:payment', item)
			})
		})

		this.orderForm.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement
			const field = target.name;
			const value = target.value;
			this.events.emit('order:changeAddress', { field, value })
		})

		this.orderForm.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('contacts:open');
		})
	}

	get paymentChoice(): string {
		return this._paymentChoice
	}

	set paymentChoice(paymentMethod: string) {
		this._paymentChoice = paymentMethod
		this.orderButtons.forEach(item => {
			item.classList.toggle('button_alt-active', item.name === paymentMethod)
		})
	}

	set valid(value: boolean) {
		this.buttonSubmit.disabled = !value
	}

	displayOrder() {
		return this.orderForm
	}
}