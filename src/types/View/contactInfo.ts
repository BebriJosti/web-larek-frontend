import { IEvents } from '../../components/base/events';

interface IContactInfo {
	contactForm: HTMLFormElement
	contactInputs: HTMLInputElement[]
	contactButton: HTMLButtonElement
	contactFormErrors: HTMLElement
	displayContact(): HTMLElement
	setValid(value:boolean): void
	setFormErrors(value:string): void
}

export class ContactInfo implements  IContactInfo {
	contactForm: HTMLFormElement
	contactInputs: HTMLInputElement[]
	contactButton: HTMLButtonElement
	contactFormErrors: HTMLElement

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.contactForm = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement
		this.contactInputs = Array.from(this.contactForm.querySelectorAll('.form__input'))
		this.contactButton = this.contactForm.querySelector('.button')
		this.contactFormErrors = this.contactForm.querySelector('.form__errors')

		this.contactInputs.forEach(item => {
			item.addEventListener('input', (event) => {
				const target = event.target as HTMLInputElement
				const field = target.name
				const value = target.value
				this.events.emit(`contacts:change`, { field, value })
			})
		})

		this.contactForm.addEventListener('submit', (event: Event) => {
			event.preventDefault()
			this.events.emit('success:open')
		})
	}
	setValid(value: boolean) {
		this.contactButton.disabled = !value
	}

	setFormErrors(value: string) {
		this.contactFormErrors.textContent = value
	}

	displayContact() {
		return this.contactForm
	}
}