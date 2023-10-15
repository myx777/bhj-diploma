
/**
 * Основная функция для совершения запросов
 * на сервер.
 */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest;

  xhr.onload = function() {
    if (xhr.status != 200) {
      callback(new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`));
    } else {
      callback(null, xhr.response);
    }
  }

  xhr.onerror = function() {
    callback(new Error(`Request failed!`));
  }

  if (options.method === 'GET') {
    const urlGet = new URL(options.url);
    urlGet.search = new URLSearchParams(options.data).toString();

    xhr.open('GET', urlGet, true);
    xhr.responseType = 'json';
    xhr.send();
  } else if (options.method === 'POST') {
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

function createRequest(options) {
  const { url, data, method, callback } = options;

  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let requestUrl = url;
  if (method === 'GET') {
    const urlGet = new URL(url);
    urlGet.search = new URLSearchParams(data).toString();
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