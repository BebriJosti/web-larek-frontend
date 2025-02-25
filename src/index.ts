import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { CardsModel } from './types/Model/cardsModel';
import { ensureElement } from './utils/utils';
import { Card, CardPreview } from './types/View/cards';
import { ApiModel } from './types/Model/apiModel';
import { IOrderForm, IProduct } from './types';
import { Modal } from './types/View/modal';
import { Basket } from './types/View/basketView';
import { BasketModel } from './types/Model/basket';
import { Order } from './types/View/order';
import { PayForm } from './types/Model/payForm';
import { ContactInfo } from './types/View/contactInfo';
import { Success } from './types/View/success';
import { BasketItem } from './types/View/basketItem';

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
const basketModel = new BasketModel()
const basket = new Basket(basketTemplate, events)
const payForm = new PayForm(events, basketModel)
const order = new Order(orderTemplate, events)
const contacts = new ContactInfo(contactsTemplate, events)
const success = new Success(successTemplate, events)

apiModel.getCardList()
	.then(function (data) {
		cardsModel.productCards = data
	})
	.catch(error => console.log(error))

events.on('products:obtain', () => {
	cardsModel.productCards.forEach(item => {
		const card = new Card(cardCatalogTemplate, events,
			{ onClick: () => events.emit('product:select', item) }
		)
		card.displayBasketCount(basketModel.basketCounter())
		ensureElement('.gallery').append(card.displayCard(item))
	})
})

events.on('product:select', (item: IProduct) => {
	cardsModel.setPreview(item)
})

events.on('modalCard:open', (item: IProduct) => {
	const cardPreview = new CardPreview(cardPreviewTemplate, events)
	modal.content = cardPreview.displayPreview(item)
	modal.render()
})

events.on('basket:add', () => {
	basketModel.addProductToBasket(cardsModel.clickedCard)
	modal.close()
})

events.on('basket:itemRemove', (item: IProduct) => {
	basketModel.removeProductToBasket(item)
	basket.displayBasketSum(basketModel.totalPriceProducts())

	events.emit('basket:open')
})

events.on('basket:open', () => {
	const totalPrice = basketModel.totalPriceProducts()
	basket.displayBasketSum(totalPrice)

	const basketItems = basketModel.basketItems.reduce((acc: HTMLElement[], item, index) => {
		const basketItem = new BasketItem(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:itemRemove', item),
		})
		acc.push(basketItem.displayBasketItem(item, index + 1))
		return acc
	}, [])

	basket.basketItems = basketItems
	modal.content = basket.displayBasket()
	modal.render()
})

events.on('order:open', () => {
	modal.content = order.displayOrder()
	modal.render()
})

events.on('order:payment', (button: HTMLButtonElement) => {
	payForm.payment = button.name
})

events.on('order:changeAddress', (data: { field: string, value: string }) => {
	payForm.setAddress(data.field, data.value)
})

events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors
	const isValid = !address && !payment
	order.setValid(isValid)
	const errorMessages = Object.values({ address, payment })
		.filter(i => !!i)
		.join(', ');
	order.setFormErrors(errorMessages);
})

events.on('contacts:open', () => {
	modal.content = contacts.displayContact()
	modal.render()
})

events.on(`contacts:change`, (data: { field: string, value: string }) => {
	payForm.setContact(data.field, data.value)
})

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors
	contacts.valid = !email && !phone
	contacts.contactFormErrors.textContent = Object.values({phone, email})
		.filter(i => !!i)
		.join(', ')
})

events.on('success:open', () => {
	apiModel.postOrder(payForm.getPurchasedOrder())
		.then(() => {
			modal.content = success.displaySuccess(basketModel.totalPriceProducts())
			basketModel.clearBasket()
			// basket.displayBasketCount(basketModel.basketCounter())
			modal.render()
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