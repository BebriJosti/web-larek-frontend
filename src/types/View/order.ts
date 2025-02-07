 interface IOrder extends IOrderForm{
	 orderForm: HTMLFormElement
	 orderButtons: HTMLButtonElement[]
	 displayOrder(): HTMLElement
	 paymentChoice(paymentMethod: string):void
}