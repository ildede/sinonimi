const fs = require("node:fs");
const require1 = require('../public/result.json');

const keys = Object.keys(require1);
console.log('JSON entries before', keys.length);

keys.forEach((key) => {
    const element = require1[key];
    element.sinonimi = Array.from(new Set(element.sinonimi)).sort((a, b) => a.localeCompare(b));
    element.contrari = Array.from(new Set(element.contrari)).sort((a, b) => a.localeCompare(b));
});

fs.writeFileSync('tmp.json', JSON.stringify(require1));
console.log('file written');
