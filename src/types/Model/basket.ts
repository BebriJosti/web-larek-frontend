interface IBasketModel {
	basketItems: IProduct
	addProductToBasket(data: IProduct): void
	deleteProductToBasket(item: IProduct): void
	clearBasket(): void
	basketCounter: () => number
	totalPriceProducts: () => number
}