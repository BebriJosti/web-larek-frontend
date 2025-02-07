interface IApiModel {
	items: IProductList
	getProductList: () => Promise<IProductList>
	postOrder: (order: IProduct) => Promise<IOrderResult>
}

