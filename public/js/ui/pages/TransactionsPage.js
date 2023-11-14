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
  constructor(element) {
    if (!element) {
      throw new Error('Empty element!');
    }

    this.element = element;
    this.lastOptions = null;
    this.transactionId = null;

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
    const buttonDeleteTransaction = this.element.querySelectorAll('.transaction__remove');
  
    if (buttonDeleteAccount) {
      buttonDeleteAccount.addEventListener('click', this.removeAccount.bind(this));
    }
  
    if (buttonDeleteTransaction) {
      buttonDeleteTransaction.forEach(button => {
        button.addEventListener('click', () => {
          this.transactionId = { id: button.dataset.id };
          this.removeTransaction();
        });
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
      const accountId = { id: this.lastOptions.account_id };
      Account.remove(accountId, (err, response) => {
        if (err) {
          console.error("Error removing accounts:", err);
          return;
        }
        
        if(response.success) {
          App.updateWidgets();
          App.updateForms();
        } 
      });
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction() {
    if(this.transactionId === null) {
      return;
    }
    if (window.confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(this.transactionId, (err, response) => {
        if (err) {
          console.error('Error removing transaction:', err);
          return;
        }
        if(response.success) {
          App.update();
        }
      });
    }
  }


/**
 * С помощью Account.get() получает название счёта и отображает
 * его через TransactionsPage.renderTitle.
 * Получает список Transaction.list и полученные данные передаёт
 * в TransactionsPage.renderTransactions()
 * */
render(options) {
  if (!options) {
    return;
  }

  this.lastOptions = options;

  const accountPromise = new Promise((resolve, reject) => {
    Account.get(options, (err, response) => {
      if (err) {
        console.error("Ошибка при получении данных о счете:", err);
        reject(err);
        return;
      }

      if (response.success) {
        const accounts = response.data;
        accounts.forEach(account => {
          if(options.account_id === account.id) {
            resolve(account.name);
          }
          
        });
        
      }
    });
  });

  const transactionPromise = new Promise((resolve, reject) => {
    Transaction.list(options, (err, response) => {
      if (err) {
        console.error("Error fetching transactions:", err);
        reject(err);
        return;
      }
      if (response.success) {
        const transactions = response.data;
        resolve(transactions);
      }
    });
  });

  Promise.all([accountPromise, transactionPromise])
    .then(([account, transactions]) => {
      this.renderTitle(account);
      this.renderTransactions(transactions);
      this.registerEvents();
    })
    .catch((error) => {
      console.error("Ошибка в Promise.all:", error);
    });
}

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const content = this.element.querySelector('.content');
    content.innerHTML = ''; // Очищаем содержимое контейнера
    this.renderTransactions();
    this.renderTitle('Название счёта');
    this.lastOptions = null;
    this.transactionId = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    if(!name) {
      return;
    }

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
    return `
      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
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
    if(!data) {
      return;
    }
    const contentElement = this.element.querySelector('.content');
    contentElement.innerHTML = '';
    contentElement.innerHTML = data.map((item) => this.getTransactionHTML(item)).join('');
  }
}