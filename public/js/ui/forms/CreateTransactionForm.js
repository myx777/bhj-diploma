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
    
    Account.list({}, (err, response) => { //пустой объект
      if (err) {
        console.error("Error fetching accounts:", err);
        return;
      }

      const accounts = response.data;
      // console.log(accounts)

      accounts.forEach((account) => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.name;
        accountsSelect.appendChild(option);
      });
      
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data , (err, response) => {
      if (err) {
        console.error("Error fetching accounts:", err);
        return;
      }

      if(response.success) {
        App.clear();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        App.update();
      }
    });
  }
}