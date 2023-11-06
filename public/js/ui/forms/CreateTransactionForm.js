/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsSelect = this.element.querySelector('.accounts-select');
    accountsSelect.innerHTML = ''; // очищаю список перед добавлением новых элементов
    
    Account.list({}, (err, response) => { //пустой объект
      if (err) {
        console.error("Error fetching accounts:", err);
        return;
      }
      if(response.data) {
        const accounts = response.data;
        // Используем метод reduce для накопления строк разметки в переменной acc.
        const optionsMarkup = accounts.reduce((acc, item) => {
          return acc + `<option value="${item.id}">${item.name}</option>`;
        }, '');
        
        accountsSelect.innerHTML = optionsMarkup;
      }

    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err) {
        console.error("Error fetching accounts:", err);
        return;
      }
      console.log(response)
      if(response.success) {
        App.update();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
      }
    });
  }
}