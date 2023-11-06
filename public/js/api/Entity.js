/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */

class Entity {
  static URL = '';

  static request(method, data, callback) {
    const options = {
      url: this.URL,
      data,
      method,
      responseType: 'json',
      callback,
    };
    console.log(options)
    createRequest(options);
  }

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */

  static list(data, callback){
    this.request('GET', data, callback);
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    console.log(data)
    this.request('PUT', data, callback);
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback ) {
    this.request('DELETE', data, callback);
  }
}
