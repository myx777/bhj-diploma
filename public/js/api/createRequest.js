
/**
 * Основная функция для совершения запросов
 * на сервер.
 */
const createRequest = (options = {}) => {
  // Создаем объект fetchOptions, который будет содержать параметры для запроса
  const fetchOptions = {
    method: options.method, // Метод запроса (GET, POST, и так далее)
  };

  const urlGet = options.url;

  // Проверяем метод запроса
  if (fetchOptions.method === 'GET') {
    // Если метод GET, то формируем URL с параметрами из data
    urlGet.search = new URLSearchParams(options.data).toString();
  } else if (fetchOptions.method !== 'GET') {
    // Если метод не GET, то формируем тело запроса (body)
    const formData = new FormData();
    for (const key in options.data) {
      formData.append(key, options.data[key]);
    }
    // Устанавливаем тело запроса
    fetchOptions.body = formData;
  }
  // Выполняем AJAX-запрос с использованием fetch
  fetch(urlGet, fetchOptions)
    .then((response) => {
      // Проверяем, был ли успешный HTTP-статус
      if (!response.ok) {
        throw new Error(`Mistakes HTTP: ${response.status}`);
      }
      // Возвращаем JSON-ответ
      return response.json();
    })
    .then((result) => {
      // Вызываем callback с данными ответа
      options.callback(null, result);
    })
    .catch((error) => {
      // В случае ошибки вызываем callback с ошибкой
      options.callback(error);
    });
};