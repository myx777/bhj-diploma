/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) {
      throw new Error('Empty element!');
    }

    this.element = element;
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const buttonDeleteAccount = this.element.querySelector('.remove-account');
    const buttonDeleteTransaction = this.element.querySelector('.transaction__remove');

    buttonDeleteAccount.addEventListener('click', () => {
      this.removeAccount();
    });

    if (buttonDeleteTransaction) {
      buttonDeleteTransaction.addEventListener('click', () => {
        this.removeTransaction();
      });
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions === null) { 
      return;
    };

    if (window.confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove({}, (err, response) => {
        if (err) {
          console.error("Error removing accounts:", err);
          return;
        }
        // const account = response.data;
        this.clear();
        App.updateWidgets();
        App.updateForms()
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (window.confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, (err, response) => {
        if (err) {
          console.error('Error removing transaction:', err);
          return;
        }
        App.update();
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(!options) { 
      return;
    };

    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (err) {
        console.error("Error fetching accounts:", err);
        return;
      }

      if(response.success) {
        const account = response.data;
        // console.log(account)
        this.renderTitle(account.name);
        
      }

      Transaction.list(options.account_id, (err, response) => {
        if (err) {
          console.error("Error fetching transactions:", err);
          return;
        }
        console.log(response)
        this.renderTransactions(response.data);
      });
    });
    // console.log(this.element)

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const content = this.element.querySelector('.content');
    content.innerHTML = ''; // Очищаем содержимое контейнера
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    // console.log(name)
    const contentTitle = this.element.querySelector('.content-title');
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    return new Date(date).toLocaleDateString('ru-RU', options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    // console.log(item)
    return `
      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">Новый будильник</h4>
            <!-- дата -->
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>
    `
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    // this.clear();
    console.log(data)
    const contentElement = this.element.querySelector('.content');
    contentElement.innerHTML = '';

    data.forEach(item => {
      const transactionHTML = this.getTransactionHTML(item);
      contentElement.insertAdjacentHTML('beforeend', transactionHTML);
    });
  }
}