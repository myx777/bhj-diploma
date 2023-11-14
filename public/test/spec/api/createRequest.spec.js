describe('Функция createRequest', () => {
  const { open } = XMLHttpRequest.prototype;
  const { send } = XMLHttpRequest.prototype;
  XMLHttpRequest.prototype.open = function (method, url, async) {
    this.requestMethod = method;
    this.requestURL = url;
    open.call(this, method, url, async);
  };

  XMLHttpRequest.prototype.send = function (data) {
    this.data = data;
    send.call(this, data);
  };

  it('Определена', () => {
    expect(createRequest).to.be.a('function');
  });

  it('Создаёт объект XMLHttpRequest', () => {
    const xhr = createRequest();
    expect(xhr).to.an.instanceof(XMLHttpRequest);
  });

  it('Передаёт параметр responseType', () => {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    const xhr = createRequest({
      url,
      responseType: 'json',
      method: 'POST',
    });
    expect(xhr.responseType).to.equal('json');
  });

  it('Передаёт параметр url', () => {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    const xhr = createRequest({
      url,
      method: 'POST',
    });

    expect(xhr.requestURL).to.equal(url);
  });

  it('Передаёт параметр method', () => {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    const xhr = createRequest({
      url,
      method: 'POST',
    });
    expect(xhr.requestMethod).to.equal('POST');
  });

  it('Вызывает callback и передаёт данные при успешном запросе', (done) => {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    const xhr = createRequest({
      url,
      responseType: 'json',
      method: 'GET',
      callback: (err, data) => {
        expect(data).to.be.a('object');
        done();
      },
    });
  });

  it('Передаёт FormData из свойства data (для методов кроме GET)', () => {
    const dummy = (f) => f;
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    const data = {
      hello: 'world',
      iron: 'maiden',
    };
    const xhr = createRequest({
      url,
      method: 'POST',
      data,
    });
    const sentData = [...xhr.data].reduce((target, [key, value]) => {
      target[key] = value;
      return target;
    }, {});
    expect(data).to.eql(sentData);
  });
});
