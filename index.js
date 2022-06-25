const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const generateToken = require('./generateToken');
const loginValidate = require('./loginMiddleware');

const app = express();
const TALKER_JSON = './talker.json';
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// req 01
app.get('/talker', async (_req, res) => {
    const getTalker = JSON.parse(await fs.readFile(TALKER_JSON));
    res.status(HTTP_OK_STATUS).json(getTalker);
});
// req 02
app.get('/talker/:id', async (req, res) => {
  const getTalker = JSON.parse(await fs.readFile(TALKER_JSON));
  const talkerID = getTalker.find(({ id }) => id === Number(req.params.id));

  if (!talkerID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
   return res.status(HTTP_OK_STATUS).json(talkerID);
});
// req 03 e req 4
app.post('/login', loginValidate, (_req, res) => {
  const tokens = generateToken();
    return res.status(HTTP_OK_STATUS).json({ token: tokens });
 });

// validacoes //
const isValideToken = (req, res, next) => {
  try { 
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token não encontrado' });
    }
    if (authorization.length !== 16) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    return next();
  } catch (error) {
    return res.status(500).end();
  }
};

const isValideAge = (req, res, next) => {
  try {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
      return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  return next();
} catch (error) {
  return res.status(500).end();
}
};

const isValideUserName = (req, res, next) => {
  try {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
      return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  return next();
} catch (error) {
  return res.status(500).end();
}
};

const isValideTalk = (req, res, next) => {
  try {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  return next();
  } catch (error) {
    return res.status(500).end();
  }
};

const isValideTalkRate = (req, res, next) => {
  try {
  const { talk: { rate } } = req.body;
  if (rate === undefined) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  if (rate < 1 || rate > 5) {
      return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  return next();
  } catch (error) {
  return res.status(500).end();
  }
};

const isValideTalkerWatched = (req, res, next) => {
  try {
  const { talk: { watchedAt } } = req.body;
  const regexDate = /^\d{2}\/\d{2}\/\d{4}$/;
  const watchedTest = regexDate.test(watchedAt);
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!watchedTest) {
  return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  return next();
} catch (error) {
  return res.status(500).end();
  }
};
// req 5
app.post('/talker', 
isValideToken, 
isValideUserName, 
isValideAge, 
isValideTalk, 
isValideTalkRate, 
isValideTalkerWatched,
async (req, res) => {
  const getTalker = JSON.parse(await fs.readFile(TALKER_JSON, 'utf8'));
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const incrementID = getTalker.length + 1;
  getTalker.push({ name, age, id: incrementID, talk: { watchedAt, rate } });
  await fs.writeFile(TALKER_JSON, JSON.stringify(getTalker));

  return res.status(201).json({ name, age, id: incrementID, talk: { watchedAt, rate } });
});
// req 6
app.put('/talker/:id', 
isValideToken, 
isValideUserName, 
isValideAge, 
isValideTalk, 
isValideTalkerWatched, 
isValideTalkRate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const getTalker = JSON.parse(await fs.readFile(TALKER_JSON));

  const newObj = { name, age, id: Number(id), talk: { watchedAt, rate } };
  const user = getTalker.map((userData) => {
    if (userData.id === Number(id)) { 
      return newObj;
  }
    return userData;
  });
  await fs.writeFile(TALKER_JSON, JSON.stringify(user));
    res.status(HTTP_OK_STATUS).json(newObj);
});

/* // req 7
app.delete('/talker/:id', async (_req, res) => {
  const getTalker = JSON.parse(await fs.readFile(TALKER_JSON ));
  res.status(HTTP_OK_STATUS).json(getTalker);
}); */
app.listen(PORT, () => {
  console.log('Online');
});
