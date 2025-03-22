import { IEvents } from '../base/events'
import { ensureElement } from '../../utils/utils'
import { Component } from '../base/component'

export interface IModalData {
	content: HTMLElement
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement
	protected _content: HTMLElement
	protected _keyDownHandler: (event: KeyboardEvent) => void
	protected _pageWrapper: HTMLElement

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container)

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container)
		this._content = ensureElement<HTMLElement>('.modal__content', container)
		this._pageWrapper = document.querySelector('.page__wrapper')

		this._closeButton.addEventListener('click', this.close.bind(this))
		this.container.addEventListener('click', this.close.bind(this))
		this._content.addEventListener('click', (event) => event.stopPropagation())

		this._keyDownHandler = this.handleKeyDown.bind(this)
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value)
	}

	open() {
		this.container.classList.add('modal_active')
		this.events.emit('modal:open');
		document.addEventListener('keydown', this._keyDownHandler)
	}

	close() {
		this.container.classList.remove('modal_active')
		this.content = null
		this.events.emit('modal:close')

		document.removeEventListener('keydown', this._keyDownHandler)
	}

	handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.close()
		}
	}

	set locked(value: boolean) {
		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked')
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked')
		}
	}

	render(): HTMLElement {
		super.render()
		this.open()
		return this.container
	}
}