interface IFormModel extends IOrderForm {
	validateOrder(): boolean
	validateContactInfo(): boolean
	setAddress(field: string, value: string): void
	setContact(field: string, value: string): void
	getPurchasedOrder(): object
}
