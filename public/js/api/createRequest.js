/**
 * Основная функция для совершения запросов
 * на сервер.
 */
const createRequest = (options = {}) => {
  // Создаем объект fetchOptions, который будет содержать параметры для запроса
  const fetchOptions = {
    method: options.method, // Метод запроса (GET, POST, и так далее)
  };

    // Используем относительный путь или конфигурируемый базовый URL
    const baseUrl = window.API_BASE_URL || 'http://localhost:8000';
    const urlGet = new URL(options.url, baseUrl);
  
  if(fetchOptions.method === 'GET') {
    for (const key in options.data) {
      urlGet.searchParams.set(key, options.data[key]);
    }
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
  fetch(urlGet.href, fetchOptions)
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
