import { IEvents } from '../../components/base/events';
import { createElement } from '../../utils/utils';

interface IBasket {
	basket: HTMLElement
	basketTitle: HTMLElement
	basketList: HTMLElement
	basketButton: HTMLButtonElement
	basketPrice: HTMLElement
	displayBasket():HTMLElement
	displayBasketCount(value: number): void
	displayBasketSum(sum: number): void
