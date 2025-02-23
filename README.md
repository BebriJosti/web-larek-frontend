# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Архитиктура приложения MVP (Model-View-Presenter)
- Model: представляет данные приложения и бизнес-логику. Она содержит всю необходимую информацию для 
работы приложения и обеспечивает доступ к данным через интерфейсы или методы.
- View: отображает интерфейс пользователя и передает события от пользователя 
(такие как нажатия кнопок, ввод текста и т.п.) презентеру.
- Presenter: является посредником между моделью и представлением. Он получает данные от модели, 
обрабатывает их и передает представление. Когда пользователь взаимодействует с представлением,
оно отправляет событие презентеру, который решает, какие изменения нужно внести в модель и представление.

# Интерфейсы:  

## Интерфейс IProduct
Предназначен для представления товара в магазине. Включает ключевые параметры продукта:
идентификатор, описание, изображение, наименование, категорию, стоимость

- id: string
- description: string
- image: string
- title: string
- category: string,
- price: number | null

## Интерфейс IOrderForm
Предназначен для формы заказа. Описывает способ оплаты, адресс, электронную почту, телефон и
общую стоимость товаров

- payment: string
- address: string
- email: string
- phone: number | string
- total:number

## Интерфейс IOrderResult
Предназначен для результата заказа,содержит идентификатор и общую стоимость товаров

- id:string
- total:number

## Интерфейс IBasketModel
Интерфейс, описывающий коллекцию карточек в корзине.
Включает массив объектов, методы для получения и удаления объектов в корзине,
очищение корзины и подсчёта товара с его общей стоимостью

- basketItems: IProduct[]
- addProductToBasket(data: IProduct): void
- removeProductToBasket(item: IProduct): void
- clearBasket(): void
- basketCounter(): number
- totalPriceProducts(): number

## Интерфейс ICard
Определяет структуру карточки продукта.

### Поля
- cardCategory: string — категория карточки.

### Методы

- displayCard(data: IProduct): HTMLElement — отображает карточку на основе переданных данных о продукте.
- setPrice(value: number | null): string — форматирует цену в виде строки.

## Интерфейс IBasket
Определяет структуру корзины покупок.

### Поля:
- basket: HTMLElement —  элемент корзины.
- basketTitle: HTMLElement — заголовок корзины.
- basketList: HTMLElement — список товаров в корзине.
- basketButton: HTMLButtonElement — кнопка оформления заказа.
- basketPrice: HTMLElement — элемент с суммой заказа.
- basketHeaderCounter: HTMLElement — счётчик товаров в заголовке корзины.
- basketHeaderButton: HTMLButtonElement — кнопка открытия корзины.

### Методы:
- displayBasket(): HTMLElement — отображает корзину.
- displayBasketCount(value: number): void — обновляет счётчик товаров в корзине.
- displayBasketSum(sum: number): void — обновляет сумму заказа.

## Интерфейс IBasketItem
Определяет структуру элемента корзины.

### Поля:
- basketItem: HTMLElement — контейнер элемента корзины.
- index: HTMLElement — индекс товара в списке.
- title: HTMLElement — заголовок товара.
- price: HTMLElement — цена товара.
- buttonDelete: HTMLButtonElement — кнопка удаления товара из корзины.

### Методы:
- displayBasketItem(data: IProduct, item: number): HTMLElement — заполняет элемент 
корзины данными о продукте и его порядковым номером.

## Интерфейс IOrder
Определяет структуру заказа.

### Поля:
- orderForm: HTMLFormElement — форма заказа.
- orderButtons: HTMLButtonElement[] — кнопки выбора способа оплаты.
- paymentChoice: string — выбранный способ оплаты.

### Метод:
- displayOrder(): HTMLElement — отображает форму заказа.

## Интерфейс IContactInfo
Определяет структуру формы контактной информации.

### Поля:
- contactForm: HTMLFormElement — форма для ввода контактной информации.
- contactInputs: HTMLInputElement[] — массив полей ввода.
- contactButton: HTMLButtonElement — кнопка отправки формы.
- contactFormErrors: HTMLElement — контейнер для отображения ошибок.

### Метод:
- displayContact(): HTMLElement — отображает форму контактов.

## Интерфейс ISuccess
Определяет структуру успешного завершения заказа.

### Свойства:
- success: HTMLElement — контейнер сообщения об успешном заказе.
- successText: HTMLElement — текстовое описание успешного заказа.
- button: HTMLButtonElement — кнопка закрытия.

#### Метод:
- displaySuccess(total: number): HTMLElement — отображает сообщение об успешной оплате с указанной суммой.

# Базовые классы:

## Api
Класс Api нужен для работы с запросами к серверу

- handleResponse: обрабатывает ответ от сервера, в случае успеха возрващает данные
- get: выполняет GET запрос, затем обрабатывает ответ через handleresponse
- post: выполняет POST запрос, затем обрабатывается ответ через handleresponse

## EventEmitter
Брокер сообщений, устанавливает, вызывает и снимает слушатели событий. Предствляет собой Presenter, обеспечивая
связь между моделями данных и пользовательским интерфейсом, синхронизацию данных и визуализацию при 
возникновении определенных событий, координируя взаимодействие между ними.

Паттерн Observer позволяет создать зависимость между объектами-наблюдателями и одним объектом-источником.
При изменении состояния источника все наблюдатели автоматически об этом оповещаются.

Такой подход удобен, когда разные части системы должны оставаться независимыми друг от друга, 
но при этом должны обмениваться информацией.

- on: добавляет новый обработчик к указанному событию. Если для этого события еще нет подписчиков, создается новая коллекция
- off: удаляет указанный обработчик из списка подписчиков конкретного события. Если после удаления обработчиков список 
становится пустым, удаляется вся запись о событии
- emit: инициирует событие, вызывая всех подписчиков, связанных с этим событием
- trigger: возвращает функцию, которая инициирует указанное событие при своем вызове.

# Model:

## ApiModel 
Класс ApiModel является расширением базового класса Api и предназначен для взаимодействия с сервером, 
получения списка товаров и отправки заказов. Он реализует интерфейс IApiModel.

КОнструктор:

constructor(baseUrl: string, cdn: string, options?: RequestInit)

- baseUrl (string): Базовый URL для запросов к серверу.
- cdn (string): URL для подстановки пути к изображениям.
- options (RequestInit): Дополнительные опции для запросов.

### Свойства^

- items: IProduct[]: Массив товаров.
- cdn: string: URL  для подстановки пути к изображениям.

### Методы:

-getCardList(): Promise<IProduct[]> - Получает список товаров с сервера.
postOrder(order: IOrderForm): Promise<IOrderResult> - Отправляет заказ на сервер.

## BasketModel  
Класс BasketModel реализует интерфейс IBasketModel и предназначен для управления данными
корзины покупок. Он предоставляет методы для добавления, удаления и очистки товаров в корзине,
а также для получения количества товаров и общей стоимости товаров в корзине.

### Поля:
- basketItems: IProduct[] - массив карточек товара

### Методы класса:

- addProductToBasket(data: IProduct):void - Добавляет товар в корзину
- removeProductToBasket(item: IProduct):void - Удаляет товар из корзины
- clearBasket():void - Очищает корзину
- basketCounter():number - Считает количество товара в корзине
- totalPriceProducts():number - Считает общую стоимость товара корзине
- get basketItems(): IProduct[] - Геттер для получения массива товаров в корзине
- set basketItems(arr: IProduct[]) - Сеттер для установки массива товаров в корзине.

## CardsModel
Этот класс отвечает за получение и сохранение данных продукта с сервера,
конструктор принимает инстант брокера сообщений

### Поля класса:

- productCards: IProduct[] - массиов объектов товара
- clickedCard: IProduct | null - выбранный твоар 

### Методы класа:
- get productCards(): IProduct[] - возвращает массив объектов
- set productCards(arr: IProduct[]) - подписывает массив объектов на событие 
- setPreview(item: IProduct):void - получает данные карточки на которую кликнул пользователь

## PayForm
Данный класс отвечает за хранение информации и логику работы с данными заказа и валидацию формы

Конструктор класса PayForm принмает events - объект для управления событиями.

### Поля класса:
- payment: string  Выбранный способ оплаты.
- email: string  Адрес электронной почты пользователя.
- phone: string Номер телефона пользователя.
- address: string Адрес доставки заказа.
- total: number Общая стоимость заказа.
- items: string[] Массив товаров в заказе
- formErrors: FormErrors = {}  бъект, содержащий ошибки валидации формы. Ключи - имена полей, значения 
сообщения об ошибках.

### Методы класа:
- validateOrder(): boolean - валидация адреса и выбора оплаты
- validateContactInfo(): boolean - валидация контактной информации 
- setAddress(field: string, value: string): void - устанавливает адресс пользователя
- setContact(field: string, value: string): void - устанавливает контактные данные пользователя 
- getPurchasedOrder(): object - возвращает объект данных пользователя с выбранными товарами

# View:

## Card
Реализует интерфейс ICard. Представляет базовую карточку товара.
Конструктор:

constructor(template: HTMLTemplateElement, events: IEvents, actions?: IActions)

- template — HTML-шаблон карточки.
- events — объект управления событиями.
- actions — объект, содержащий обработчики событий.


### Поля:

- _cardElement: HTMLElement —  элемент карточки.
- _cardCategory: HTMLElement — элемент с категорией товара.
- _cardTitle: HTMLElement — заголовок карточки.
- _cardImage: HTMLImageElement — картинка карточки.
- _cardPrice: HTMLElement — элемент с ценой.
- _cardDescription: Map<string, string> — описание карточки

### Методы класа:

- get cardCategory(): string — возвращает текущую категорию карточки.
- set cardCategory(value: string) — задаёт категорию карточки.
- setPrice(value: number | null): string — возвращает отформатированную цену (бесценно если null).
- displayCard(data: IProduct): HTMLElement — заполняет карточку данными и возвращает её элемент.

## Basket
Реализует интерфейс IBasket. Представляет отображение корзины покупок.

 Конструктор:

constructor(template: HTMLTemplateElement, events: IEvents)

- template — HTML-шаблон корзины.
- events — объект управления событиями.

### Свойства:
- basket: HTMLElement —  элемент корзины.
- basketTitle: HTMLElement — заголовок корзины.
- basketList: HTMLElement — список товаров.
- basketButton: HTMLButtonElement — кнопка оформления заказа.
- basketPrice: HTMLElement — элемент с итоговой суммой заказа.
- basketHeaderCounter: HTMLElement — счётчик товаров в корзине.
- basketHeaderButton: HTMLButtonElement — кнопка открытия корзины.

### Методы:
- set basketItems(items: HTMLElement[]) — обновляет список товаров в корзине и управляет состоянием кнопки оформления.
- displayBasketCount(value: number) — обновляет отображение количества товаров в корзине.
- displayBasketSum(sum: number) — обновляет отображение общей суммы заказа.
- displayBasket(): HTMLElement — отображает корзину.

## Класс BasketItem
Реализует интерфейс IBasketItem. Представляет элемент корзины.

Конструктор:

constructor(template: HTMLTemplateElement, events: IEvents, actions?: IActions)

- template — HTML-шаблон элемента корзины.
- events — объект управления событиями.
- actions — объект с обработчиками событий (например, удаление товара).

### Поля:
- basketItem: HTMLElement — контейнер элемента корзины.
- index: HTMLElement — индекс товара в списке.
- title: HTMLElement — заголовок товара.
- price: HTMLElement — цена товара.
- buttonDelete: HTMLButtonElement — кнопка удаления товара из корзины.

### Методы:
- displayBasketItem(data: IProduct, item: number): HTMLElement — заполняет элемент корзины данными о продукте и порядковым номером.
- protected setPrice(value: number | null): string — возвращает строковое представление цены (бесценно если null).

## Класс Order
Реализует интерфейс IOrder. Представляет форму оформления заказа.

Конструктор:

constructor(template: HTMLTemplateElement, events: IEvents)

- template — HTML-шаблон формы заказа.
- events — объект управления событиями.

### Поля:
- orderForm: HTMLFormElement — форма заказа.
- orderButtons: HTMLButtonElement[] — кнопки выбора способа оплаты.
- buttonSubmit: HTMLButtonElement — кнопка подтверждения заказа.
- formErrors: HTMLElement — контейнер для отображения ошибок валидации.
- private _paymentChoice: string | null — выбранный способ оплаты.

### Методы:
- displayOrder(): HTMLElement — отображает форму заказа.
- get paymentChoice(): string — возвращает текущий выбранный способ оплаты.
- set paymentChoice(paymentMethod: string) — устанавливает способ оплаты и выделяет соответствующую кнопку.
- set valid(value: boolean) — включает или отключает кнопку подтверждения заказа в зависимости от валидности формы.

## Класс ContactInfo
Реализует интерфейс IContactInfo. Представляет форму для ввода контактных данных.

Конструктор:

constructor(template: HTMLTemplateElement, events: IEvents)

- template — HTML-шаблон формы контактов.
- events — объект управления событиями.

### Поля:
- contactForm: HTMLFormElement — форма для ввода контактной информации.
- contactInputs: HTMLInputElement[] — массив полей ввода.
- contactButton: HTMLButtonElement — кнопка отправки формы.
- contactFormErrors: HTMLElement — контейнер для отображения ошибок.

### Методы:
- displayContact(): HTMLElement — возвращает HTML-элемент формы контактов.
- set valid(value: boolean) — устанавливает состояние кнопки отправки формы (disabled если форма невалидна).

## Класс Success
Реализует интерфейс ISuccess. Представляет сообщение об успешной оплате.

Конструктор:

constructor(template: HTMLTemplateElement, events: IEvents)

- template — HTML-шаблон сообщения об успешном заказе.
- events — объект управления событиями.

### Поля:
- success: HTMLElement — основной элемент уведомления об успешном заказе.
- successText: HTMLElement — текстовое описание заказа.
- button: HTMLButtonElement — кнопка закрытия.

### Метод:
- displaySuccess(total: number): HTMLElement — устанавливает текст сообщения
с суммой списания и возвращает элемент.

## Класс Modal
Класс обеспечиваает функциональность модального 
диалога. Он расширяет класс Component и предназначен для обработки 
событий, связанных с модальными окнами, таких как открытие и закрытие модального окна,
а также блокировка обертки страницы, когда модальное окно активно.

Конструктор:

constructor(container: HTMLElement, protected events: IEvents)

- container - Контейнер для модального окна.
- events - Объект управления событиями.

### Поля:

- protected _closeButton: HTMLButtonElement: Кнопка закрытия внутри модального окна.
- protected _content: HTMLElement: Контент внутри модального окна.
- protected _keyDownHandler: (event: KeyboardEvent) => void: Обработчик события keydown.
- protected _pageWrapper: HTMLElement: Обертка страницы.

### Методы:

- set content(value: HTMLElement) - Устанавливает контент модального окна.
- open() - Открывает модальное окно и отправляет событие. Также добавляет обработчик события keydown
- close() - Закрывает модальное окно, устанавливает контент в null и отправляет событие. Также удаляет обработчик события keydown
- handleKeyDown(event: KeyboardEvent) - Обрабатывает событие keydown, чтобы закрыть модальное окно при нажатии клавиши Escape.
- set locked(value: boolean) - Блокирует или разблокирует обертку страницы
- render(): HTMLElement - Отображает модальное окно

# Prsenter

## Открытие страницы:

### Получение списка продуктов:

- Запрашивается список всех доступных продуктов через apiModel.getCardList().
- Полученный массив данных сохраняется в модели cardsModel.productCards.

### Отображение продукта:

- Событие products:obtain обрабатывается, и для каждого элемента массива productCards создается экземпляр класса Card.
- Карточки добавляются в DOM в контейнер .gallery.

## Открытие карточки:

### Выбор продукта:

- По клику на продукт вызывается событие product:select, которое передает выбранный элемент (IProduct)
в обработчик события.
- В модели cardsModel устанавливается выбранная карточка с помощью метода setPreview.

### Модальное окно с карточкой:

- Вызывается событие modalCard:open, которое создает объект CardPreview и отрисовывает карточку в модальном окне.
- Модальное окно отображается методом modal.render().

## Добавление товара в корзину:

### Нажатие кнопки "Добавить в корзину":

- При событии basket:add добавляется текущий продукт в корзину через метод basketModel.addProductToBasket.
- Обновляется счетчик количества товаров в корзине методом displayBasketCount.
- Закрывается модальное окно.

## Удаление товара из корзины:

### Нажатие кнопки удаления товара:

- Через событие basket:itemRemove удаляется указанный товар из корзины с использованием метода removeProductToBasket.
- Обновляется счетчик товаров в корзине и общая сумма заказа методами displayBasketCount и displayBasketSum.
- Перезагружаются данные корзины через событие basket:open.

## Открытие корзины:

### Показ корзины:

- При событии basket:open вычисляется итоговая стоимость всех товаров в корзине через метод totalPriceProducts.
- Отображаются все товары в корзине, создавая объекты BasketItem для каждой позиции.
- Данные корзины отображаются в модальном окне с помощью метода displayBasket.

## Оформление заказа:

### Переход к оформлению заказа:

- После нажатия на кнопку "Оформить заказ" в корзине открывается модальное окно с формой оплаты.
- Передаются данные о заказе через свойство payForm.items.

### Выбранный способ оплаты:

- При выборе способа оплаты через событие order:payment заполняются данные в форме оплаты.

### Изменение адреса доставки:

- Пользователь вводит адрес через событие order:changeAddress. Поля формы проверяются на корректность ввода.
- Если форма содержит ошибки, выводятся соответствующие сообщения в компоненте order.formErrors.

### Проверка контактной информации:

- Контактные данные проверяются событием contacts:open.
- Ошибки отображаются в компоненте contacts.contactFormErrors.

## Подтверждение заказа:

### Отправка данных заказа:

- При успешном заполнении всех полей и нажатии на кнопку "Оплатить" отправляется POST-запрос через apiModel.postOrder.
- В случае успешного выполнения очищаются данные корзины и форм.

### Окно успеха:

- Открывается модальное окно с сообщением об успешной покупке через success.displaySuccess.
- Окно успеха закрывается по событию success:close.

## Блокировка прокрутки:

### Блокировка прокрутки при открытии модальных окон:

- Когда модальные окна открываются, включается блокировка прокрутки через установку свойства locked у компонента modal.
- Прокрутка разблокируется после закрытия модального окна.