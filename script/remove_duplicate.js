const fs = require("node:fs");
const require1 = require('../public/result.json');

console.log('JSON entries before', Object.keys(require1).length);
const keysWithNumbers = Object.keys(require1).filter((k) => k.match(new RegExp('[0-9]$')));
console.log('JSON entries with numbers', keysWithNumbers.length);

keysWithNumbers.forEach((keyWithNumber) => {
    const key = keyWithNumber.replace(/\d+/, '');

    const originalElement = require1[key];
    const duplicatedElement = require1[keyWithNumber];
    if (!originalElement) {
        console.error(`No original element found for ${keyWithNumber}`);
        return;
    } else {
        const mergedElement = {
            parola: key,
            sinonimi: [...originalElement.sinonimi, ...duplicatedElement.sinonimi],
            contrari: [...originalElement.contrari, ...duplicatedElement.contrari],
        }
        delete require1[keyWithNumber];
        require1[key] = mergedElement;
    }
})

console.log('JSON entries after', Object.keys(require1).length);

fs.writeFileSync('tmp.json', JSON.stringify(require1));
console.log('file written');

