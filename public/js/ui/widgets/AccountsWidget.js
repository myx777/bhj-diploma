/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(!element) {
      throw new Error('Empty element!');
    }

    this.element = element;
    
    this.update();
    this.registerEvents();
  }

  /*
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const keep = this.element.querySelector('.create-account');

    keep.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('createAccount').open();
    });

    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target;
      const closestAccount = target.closest('li.account');//иначе он считывает элемент, по которому нажали, а не всю кнопку
      if (closestAccount.classList.contains('account')) {
        this.onSelectAccount(closestAccount);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current();
  
    if (!user) {
      console.log("User is not logged in. Exiting update.");
      return;
    }
  
    Account.list({}, (err, response) => {//передаю пустой объект
      if (err) {
        console.error("Error fetching accounts:", err);
        return;
      }

      const accounts = response.data;
  
      this.clear();
      this.renderItem(accounts);
    });
  }
 
  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll('.account');

    accounts.forEach(account => {
      account.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const accounts = this.element.querySelectorAll('.account');

    accounts.forEach(account => {
      account.classList.remove('active');
    });

    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `
      <li class="account" data-id="${item.id}">
         <a href="#">
           <span>${item.name}</span> /
            <span>${item.sum}</span>
         </a>
      </li>
    `
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    this.clear(); // Очищаем счета перед добавлением новых
    data.forEach((item) => {
      const accountHTML = this.getAccountHTML(item);
      this.element.insertAdjacentHTML('beforeend', accountHTML);
    });
    // const accountHTML = this.getAccountHTML(data);
    // console.log(accountHTML)
    // this.element.insertAdjacentHTML('beforeend', accountHTML);
  }
}
