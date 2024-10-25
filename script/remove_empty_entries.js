const fs = require("node:fs");
const require1 = require('../public/result.json');

const keys = Object.keys(require1);
console.log('JSON entries before', keys.length);

keys.forEach((key) => {
    const element = require1[key];
    if (!element.sinonimi.length && !element.contrari.length) {
        delete require1[key];
    }
})

console.log('JSON entries after', Object.keys(require1).length);

fs.writeFileSync('tmp.json', JSON.stringify(require1));
console.log('file written');
