interface ICard {
	displayCard(data: IProduct): HTMLElement
	setText(element: HTMLElement, value: any): string
	setPrice(value: number | null): string
}