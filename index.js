const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

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

// req 03

app.listen(PORT, () => {
  console.log('Online');
});
