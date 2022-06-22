function loginValidate(req, res, next) {
    const regexEMAIL = /\S+@\S+\.\S+/;
    const { email, password } = req.body;
    const regexTEST = regexEMAIL.test(email);
    const msgEmail = 'O campo "email" é obrigatório';
    const msgEmail2 = 'O "email" deve ter o formato "email@email.com"';
    const msgPass = 'O campo "password" é obrigatório';
    const msgPass2 = 'O "password" deve ter pelo menos 6 caracteres';

    if (!email) return res.status(400).json({ message: msgEmail });
    if (!regexTEST) return res.status(400).json({ message: msgEmail2 });
    if (!password) return res.status(400).json({ message: msgPass });
    if (password.length < 6) return res.status(400).json({ message: msgPass2 });
    next();
}

module.exports = loginValidate;