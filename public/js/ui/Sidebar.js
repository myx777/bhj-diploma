/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const burgerMenu = document.querySelector('.sidebar-mini');
    const buttonBurgerMenu = document.querySelector('[data-toggle="push-menu"]');// кнопка по атрибутному селектору

    buttonBurgerMenu.addEventListener('click', (event) => {
      event.preventDefault();
      burgerMenu.classList.toggle('sidebar-collapse');
      burgerMenu.classList.toggle('sidebar-open');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginButton = document.querySelector('.menu-item_login');
    const registerButton = document.querySelector('.menu-item_register');
    const logoutButton = document.querySelector('.menu-item_logout');

    loginButton.addEventListener('click', (event) => {
      event.preventDefault();
      const modalLogin = App.getModal('login');
      if (modalLogin) {
        modalLogin.open();
      }
    });

    registerButton.addEventListener('click', (event) => {
      event.preventDefault();
      const modalRegister = App.getModal('register');
      if (modalRegister) {
        modalRegister.open();
      }
    });

    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      User.logout((err, response) => {
        if (response.success) {
          App.setState('init');
        }
      });
    });
  }
}
