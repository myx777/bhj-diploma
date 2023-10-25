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
    const burgerMenu = document.querySelector(".sidebar-mini");
    const buttonBurgerMenu = document.querySelector('[data-toggle="push-menu"]');//кнопка по атрибутному селектору
    
    buttonBurgerMenu.addEventListener('click', (event) => {
      event.preventDefault();
      burgerMenu.classList.toggle("sidebar-collapse");
      burgerMenu.classList.toggle("sidebar-open");
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
    const buttonsMenuItems = document.querySelectorAll('.menu-item');

    buttonsMenuItems.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
  
        if (button.classList.contains('menu-item_login')) {
          const modalLogin = App.getModal('login');
          if (modalLogin) {
            modalLogin.open();
          }
        } else if (button.classList.contains('menu-item_register')) {
          const modalRegister = App.getModal('register');
          if (modalRegister) {
            modalRegister.open();
          }
        } else if (button.classList.contains('menu-item_logout')) {
          User.logout((err, response) => {
            if (response.success) {
              App.setState('init');
            }
          });

        }
      });

    });

  }
    //!слишком много повторяющегося кода, оптимизируй, когда ui заработает!, вспомни цикл и event.target

    // const buttonMenuItemLogin = document.querySelector('.menu-item_login');//кнопка входа
    // buttonMenuItemLogin.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   const modalLogin = App.getModal('login');
    //   if(modalLogin) {
    //     modalLogin.open();
    //   }
    // });

    // const buttonMenuItemRegister = document.querySelector('.menu-item_register');
    // buttonMenuItemRegister.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   const modalRegister = App.getModal('register');
    //   if(modalRegister) {
    //     modalRegister.open();
    //   }
    // });

    // const buttonMenuItemLogout = document.querySelector('.menu-item_logout');
    // buttonMenuItemLogout.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   User.logout((err, response) => {
    //     if(response) {
    //       App.setState('init');
    //     }
    //   });
}