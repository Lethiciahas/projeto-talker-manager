const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const generateToken = require('./generateToken');
const loginValidate = require('./loginMiddleware');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// req 01
app.get('/talker', async (_req, res) => {
    const getTalker = JSON.parse(await fs.readFile('./talker.json'));
    res.status(HTTP_OK_STATUS).json(getTalker);
});
// req 02
app.get('/talker/:id', async (req, res) => {
  const getTalker = JSON.parse(await fs.readFile('./talker.json'));
  const talkerID = getTalker.find(({ id }) => id === Number(req.params.id));

  if (!talkerID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
   return res.status(HTTP_OK_STATUS).json(talkerID);
});
// req 03
app.post('/login', loginValidate, (_req, res) => {
  const tokens = generateToken();
    return res.status(HTTP_OK_STATUS).json({ token: tokens });
 });

app.listen(PORT, () => {
  console.log('Online');
});
