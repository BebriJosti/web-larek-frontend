import { IEvents } from '../base/events';

interface IContactInfo {
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
				this.events.emit(`contacts:request`, { field, value })
			})
		})

		this.contactForm.addEventListener('submit', (event: Event) => {
			event.preventDefault()
			this.events.emit('contacts:submit')
		})
	}
	setValid(value: boolean) {
		this.contactButton.disabled = !value
	}

	setFormErrors(value: string) {
		this.contactFormErrors.textContent = value
	}

	clearContact() {
		this.contactInputs.forEach(input => {
			input.value = ''
		})
	}

	displayContact() {
		this.contactButton.setAttribute('disabled', '')
		return this.contactForm
	}
}