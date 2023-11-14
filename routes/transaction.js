const router = require('express').Router();
const multer = require('multer');

const upload = multer();
const uniqid = require('uniqid');

const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync', {
  serialize: (data) => encrypt(JSON.stringify(data)),
  deserialize: (data) => JSON.parse(decrypt(data)),
});

// запрос списка транзакций
router.get('/', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));// получение БД
  // получение значения списка транзакций, для указанного счёта
  const transactions = db.get('transactions').filter({ account_id: request.query.account_id }).value();
  // отправка ответа со списком транзакций
  response.json({ success: true, data: transactions });
});

router.delete('/', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));// получение БД
  const transactions = db.get('transactions');// получение всех транзакций
  const { id } = request.body;// получение id из тела запроса
  const removingTransaction = transactions.find({ id });// нахождение удаляемой транзакции
  if (removingTransaction.value()) { // если значение транзакции существует...
    transactions.remove({ id }).write();// удалить транзакцию и записать это в БД
    response.json({ success: true });// отправление ответа с успешностью
  } else { // если значение транзакции не существует...
    response.json({ success: false });// отправление ответа с неуспешностью
  }
});

router.put('/', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));// получение БД
  const transactions = db.get('transactions');// получение всех транзакций
  const reg = /^\-?\d+(\.?\d+)?$/;
  const {
    type, name, sum, account_id,
  } = request.body;// получение значений из тела запроса
    // нахождение значения текущего пользователя
  const currentUser = db.get('users').find({ id: request.session.id }).value();
  if (!currentUser)// если текущего авторизованного пользователя нету
  // отправление ответа с ошибкой о необходимости авторизации
  { response.json({ success: false, error: 'Необходима авторизация' }); } else { // если авторизованный пользователь существует
    if (reg.test(sum)) {
      const currentUserId = currentUser.id;// получить id текущего пользователя
      // добавление существующей транзакцию к списку и записывание в БД
      transactions.push({
        id: uniqid(),
        type: type.toLowerCase(),
        name,
        sum: +sum,
        account_id,
        user_id: currentUserId,
        created_at: new Date().toISOString(),
      }).write();
      response.json({ success: true });// отправление ответа с успешностью
    } else {
      response.json({ success: false, error: 'Недопустимые символы в поле Сумма' });
    }
  }
});

module.exports = router;
