import { Api, ApiListResponse } from '../../components/base/api'
import { IOrderForm, IOrderResult, IProduct } from '../index';

interface IApiModel {
	items: IProduct[]
	getCardList: () => Promise<IProduct[]>
	postOrder: (order: IProduct) => Promise<IOrderResult>
}

 export class ApiModel extends Api {
	items: IProduct[]
	 cdn: string

	constructor(baseUrl: string, cdn:string, options?: RequestInit) {
		super(baseUrl, options)
		this.cdn = cdn
	}

	async getCardList() {
		const response = await this.get('/product')
		const typedResponse = response as ApiListResponse<IProduct>

		if (!typedResponse || !Array.isArray(typedResponse.items)) {
			throw new Error('Неверный ответ сервера')
		}

		return typedResponse.items.map(item => ({
			...item,
			image: this.cdn + item.image
		}))
	}

	async postOrder(order: IOrderForm): Promise<IOrderResult> {
		try {
			const res = await this.post('/order', order) as IOrderResult
			return res
		} catch (error) {
			console.error('Ошибка при отправке заказа:', error)
			throw error
		}
	}
}