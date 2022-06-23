function authTalkerWatched(req, res, next) {
    const { talk: { watchedAt } } = req.body;
    const regexDate = /^\d{2}\/\d{2}\/\d{4}$/;
    const watchedTest = regexDate.test(watchedAt);
//    const msgErrorTalk = 'O campo "talk" é obrigatório';
//    const msgErrorWatch = 'O campo "watchedAt" é obrigatório';
//    const msgErrorWatch2 = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
    if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    if (!watchedTest) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
    next();
}
module.exports = authTalkerWatched;