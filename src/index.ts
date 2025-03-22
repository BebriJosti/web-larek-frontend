import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { CardsModel } from './components/Model/cardsModel';
import { ensureElement } from './utils/utils';
import { BasketItem, Card, CardPreview} from './components/View/cards';
import { ApiModel } from './components/Model/apiModel';
import { IOrderForm, IProduct } from './types';
import { Modal } from './components/View/modal';
import { Basket } from './components/View/basketView';
import { BasketModel } from './components/Model/basketModel';
import { Order } from './components/View/order';
import { PayForm } from './components/Model/payForm';
import { ContactInfo } from './components/View/contactInfo';
import { Success } from './components/View/success';
import { Page } from './components/View/page';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement
const successTemplate = document.querySelector('#success') as HTMLTemplateElement

const apiModel = new ApiModel(API_URL, CDN_URL)
const events = new EventEmitter()
const cardsModel = new CardsModel(events)
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const basketModel = new BasketModel(events)
const basket = new Basket(basketTemplate, events)
const payForm = new PayForm(events)
const order = new Order(orderTemplate, events)
const contacts = new ContactInfo(contactsTemplate, events)
const success = new Success(successTemplate, events)
const page = new Page(events)

apiModel.getCardList()
	.then(function (data) {
		cardsModel.productCards = data
	})
	.catch(error => console.log(error))


events.on('products:changed', (products: IProduct[]) => {
	products.forEach(item => {
		const card = new Card(cardCatalogTemplate, events,
			{ onClick: () => events.emit('product:select', item) }
		)
		page.catalog.append(card.displayCard(item))
	})
})

events.on('product:select', (item: IProduct) => {
	cardsModel.setPreview(item)
})

events.on('modalCard:open', (item: IProduct) => {
	const cardPreview = new CardPreview(cardPreviewTemplate, events)
	const basketDuplicate = basketModel.basketItems.some(basketItem => basketItem.id === item.id);
	modal.content = cardPreview.displayPreview(item, basketDuplicate)
	modal.render()
})

events.on('basket:itemAdd', () => {
	basketModel.addProductToBasket(cardsModel.clickedCard)
	modal.close()
})

events.on('basket:itemRemove', (item: IProduct) => {
	basketModel.removeProductToBasket(item)
	events.emit('basket:open')
})

events.on('basket:changed', (items: IProduct[]) => {
	const basketItemsElements = items.reduce((acc: HTMLElement[], item, index) => {
		const basketItem = new BasketItem(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:itemRemove', item),
		})
		acc.push(basketItem.displayBasketItem(item, index + 1))
		return acc
	}, [])
	basket.displayBasketSum(basketModel.totalPriceProducts())
	basket.displayBasket(basketItemsElements)
	page.displayBasketCount(basketModel.basketCounter())
})

events.on('basket:open', () => {
	modal.content = basket.getBasketContent()
	modal.render()
})

events.on('order:open', () => {
	modal.content = order.displayOrder()
	modal.render()
})

events.on('orderPayment:request', (event:{payment:string}) => {
	payForm.setPayment(event.payment)
})

events.on('orderPayment:changed', (data:{payment:string}) => {
	order.setPaymentChoice(data.payment)
	payForm.validateOrder()
})

events.on('orderAddress:request', (data:{field:string, value:string}) => {
payForm.setAddress(data.value)
})

events.on('orderAddress:changed', () => {
	payForm.validateOrder()
})

events.on('formErrors:changed', (errors: Partial<IOrderForm>) => {
	const { address, payment, email, phone } = errors
	const isOrderValid = !address && !payment

	order.setValid(isOrderValid)

	const orderErrorMessages = Object.values({ address, payment })
		.filter(i => !!i)
		.join(', ')

	order.setFormErrors(orderErrorMessages)

	const isContactValid = !email && !phone

	contacts.setValid(isContactValid)

	const contactErrorMessages = Object.values({ phone, email })
		.filter(i => !!i)
		.join(', ')

	contacts.setFormErrors(contactErrorMessages)
})

events.on('contacts:open', () => {
	modal.content = contacts.displayContact()
	modal.render()
})

events.on('contacts:request', (data:{field:string, value:string}) =>{
	payForm.setContact(data.field, data.value)
})

events.on('orderContacts:changed', (data: { field: string, value: string }) => {
	payForm.validateContactInfo()
})

events.on('clearOrderForm', () => {
	contacts.clearContact()
	order.clearOrder()
})

events.on('contacts:submit', () => {
	apiModel.postOrder({
		payment: payForm.payment,
		email: payForm.email,
		phone: payForm.phone,
		address: payForm.address,
		total: basketModel.totalPriceProducts(),
		items: basketModel.basketItems.map(item => item.id),
	})
		.then(() => {
			modal.content = success.displaySuccess(basketModel.totalPriceProducts())
			modal.render()
			basketModel.clearBasket()
			payForm.clearForm()
		})
		.catch(error => console.log(error))
})

events.on('success:close', () => modal.close())

events.on('modal:open', () => {
	modal.locked = true
})

events.on('modal:close', () => {
	modal.locked = false
})