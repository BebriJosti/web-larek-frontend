import { IOrderForm } from '../index';
import { IEvents } from '../../components/base/events';
import { BasketModel } from './basket';

type FormErrors = Partial<Record<keyof IOrderForm, string>>

interface IPayForm extends IOrderForm {
	validateOrder(): boolean
	validateContactInfo(): boolean
	setAddress(field: string, value: string): void
	setContact(field: string, value: string): void
	getPurchasedOrder(): object
}

const ADDRESS_REGEX = /^([А-ЯЁа-яё\s]+),?\s*([А-ЯЁа-яё\s]+),?\s*([А-ЯЁа-яё\s]+)\s+(\d+)$/
const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\+\d{11}$/

export class PayForm implements IPayForm {
	payment: string
	email: string
	phone: string
	address: string
	formErrors: FormErrors = {}


	constructor(protected events: IEvents, protected basket: BasketModel) {
		this.payment = ''
		this.email = ''
		this.phone = ''
		this.address = ''
	}

	setAddress(field: string, value: string) {
		if (field !== 'address') {
			return;
		}

		this.address = value

		if (this.validateOrder()) {
			this.emitOrderReady()
		}
	}

	validateOrder() {
		const errors: FormErrors = {}

		if (!this.address) {
			errors.address = 'Необходимо указать адрес'
		} else if (!ADDRESS_REGEX.test(this.address)) {
			errors.address = 'Укажите адрес в формате: Страна, Город, Улица 123'
		}

		if (!this.payment) {
			errors.payment = 'Выберите способ оплаты'
		}

		this.formErrors = errors
		this.emitFormErrors('address', this.formErrors)
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

		if (this.validateContactInfo()) {
			this.emitOrderReady()
		}
	}

	validateContactInfo() {
		const errors: FormErrors = {}

		if (!this.email) {
			errors.email = 'Необходимо указать email'
		} else if (!EMAIL_REGEX.test(this.email)) {
			errors.email = 'Неверно указан адрес эл. почты'
		}

		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон'
		} else if (!PHONE_REGEX.test(this.phone)) {
			errors.phone = 'Введите номер в формате +79999999999'
		}

		this.formErrors = errors
		this.emitFormErrors('change', this.formErrors)
		return Object.keys(errors).length === 0
	}

	getPurchasedOrder() {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.basket.totalPriceProducts(),
			items: this.basket.basketItems.map(item => item.id),
		};
	}

	private emitOrderReady() {
		this.events.emit('order:ready', this.getPurchasedOrder())
	}

	private emitFormErrors(type: 'address' | 'change', errors: FormErrors) {
		this.events.emit(`formErrors:${type}`, errors)
	}
}
