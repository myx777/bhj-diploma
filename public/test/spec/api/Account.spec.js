describe('Класс Account', () => {
  it('Определён', () => {
    expect(Account).to.be.a('function');
  });

  it('Создаёт экземпляр Account', () => {
    expect(new Account()).to.be.an.instanceof(Account);
  });

  it('Наследуется от Entity', () => {
    expect(new Account()).to.be.an.instanceof(Entity);
  });

  it('Свойство URL имеет значение /account', () => {
    expect(Account.URL).to.be.equals('/account');
  });
});
