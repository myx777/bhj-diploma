
/**
 * Основная функция для совершения запросов
 * на сервер.
 */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest;

  xhr.onload = function() {
    if (xhr.status != 200) {
      options.callback(new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`));
    } else {
      options.callback(null, xhr.response);
    }
  }

  xhr.onerror = function() {
    options.callback(new Error(`Request failed!`));
  }

  if (options.method === 'GET') {
    const urlGet = new URL(options.url);
    urlGet.search = new URLSearchParams(options.data).toString();

    xhr.open('GET', urlGet, true);
    xhr.responseType = 'json';
    xhr.send();
  } else {
    const formData = new FormData;

    formData.append('mail', options.data.mail);
    formData.append('password', options.data.password);

    xhr.open('POST', options.url, true);
    xhr.responseType = 'json';
    xhr.send(formData);
  }
};

/** 
 
fetch

const createRequest = (options = {}) => {
  const fetchOptions = {//опции для формирования запроса
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let requestUrl = url;//дубликат ссылки, безопасность кода
  if (method === 'GET') {
    const urlGet = new URL(url);
    urlGet.search = new URLSearchParams(data).toString();//в search добавляю данные из data(пароль, емаил) и перевожу в строку
    requestUrl = urlGet;
  } else if (method === 'POST') {
    fetchOptions.body = JSON.stringify(data);
  }

  fetch(requestUrl, fetchOptions)

    .then((response) => {
      if (!response.ok) {
        throw new Error(`Mistakes HTTP: ${response.status}`);
      }
      return response.json();
    })

    .then((responseData) => {
      callback(null, responseData);
    })

    .catch((error) => {
      callback(error);
    });

}

*/