import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { BasketModel } from './basketModel';

type FormErrors = Partial<Record<keyof IOrderForm, string>>

interface IPayForm extends IOrderForm {
	validateOrder(): boolean
	validateContactInfo(): boolean
	setAddress(field: string, value: string): void
	setContact(field: string, value: string): void
	clearForm():void
}

//регулярки на случай если понадобится прописать четкий формат
// const ADDRESS_REGEX = /^([А-ЯЁа-яё\s]+),?\s*([А-ЯЁа-яё\s]+),?\s*([А-ЯЁа-яё\s]+)\s+(\d+)$/
// const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/
// const PHONE_REGEX = /^\+\d{11}$/

export class PayForm implements IPayForm {
	payment: string
	email: string
	phone: string
	address: string
	formErrors: FormErrors = {}

	constructor(protected events: IEvents) {
		this.payment = ''
		this.email = ''
		this.phone = ''
		this.address = ''
	}

	setPayment(payment:string){
		this.payment = payment
		this.events.emit("orderPayment:changed", {payment})
	}

	setAddress(value: string) {
		this.address = value
		this.events.emit("orderAddress:changed", {value})
		}


	validateOrder() {
		const errors: FormErrors = {}

		if (!this.address) {
			errors.address = 'Необходимо указать адрес'
		}
		// стр. 15
		// else if (!ADDRESS_REGEX.test(this.address)) {
		// 	errors.address = 'Неверно указан адрес'
		// }

		if (!this.payment) {
			errors.payment = 'Выберите способ оплаты'
		}

		this.formErrors = errors
		this.events.emit('formErrors:changed', this.formErrors)
		return Object.keys(errors).length === 0
	}

	setContact(field: string, value: string) {
		if (field === 'email') {
			this.email = value
		} else if (field === 'phone') {
			this.phone = value
		} else {
			return
		}
			this.events.emit("orderContacts:changed")
	}

	validateContactInfo() {
		const errors: FormErrors = {}

		if (!this.email) {
			errors.email = 'Необходимо указать email'
		}

		//стр. 15
		// else if (!EMAIL_REGEX.test(this.email)) {
		// 	errors.email = 'Неверно указан адрес эл. почты'
		// }

		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон'
		}

		//стр. 15
		// else if (!PHONE_REGEX.test(this.phone)) {
		// 	errors.phone = 'Неверно указан номер телефона'
		// }

		this.formErrors = errors
		this.events.emit('formErrors:changed', this.formErrors)
		return Object.keys(errors).length === 0
	}

	clearForm(){
		this.payment = ''
		this.email = ''
		this.phone = ''
		this.address = ''
		this.events.emit('clearOrderForm')
	}
}