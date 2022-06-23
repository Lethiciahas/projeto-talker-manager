const fs = require('fs/promises');

function setTalkers(newTalker) {
    return fs.writeFile('./talker.json', JSON.stringify(newTalker));
}

module.exports = setTalkers;