const debounce = (callback, milliseconds, timeoutId = 0) => (args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(args), milliseconds);
}
const input = document.querySelector("#pattern");
const tbody = document.querySelector('tbody');
let loadedKeys = [];
let loadedJson = {};

const toLinks = (e) => {
    return e.map(toLink).join(', ');
}

const toLink = (e) => {
    return `<a>${e}</a>`
}

window.toSearch = function (word) {
    input.value = word;
}

window.runSearch = function (word) {
    const search = word.replace(/[^a-z0-9]/gi, '');
    const found = loadedKeys.filter((k) => k.includes(search));
    found.sort((a,b) => {
        const wordA = a.replace(/[^a-z]/gi, '')
        const wordB = b.replace(/[^a-z]/gi, '')
        return wordA === wordB ? 0 : (wordA === search ? -1 : (wordB === search ? 1 : 0))
    });
    tbody.innerHTML = '';
    for (const e of found) {
        const element = loadedJson[e];
        const rowElement = document.createElement('tr');
        const split = element.parola.split(word);
        if (split.length > 1) {
            rowElement.innerHTML = `<td>${split[0] ?? ''}<mark>${word}</mark>${split[1] ?? ''}</td><td>${toLinks(element.sinonimi)}</td><td>${toLinks(element.contrari)}</td>`
        } else {
            rowElement.innerHTML = `<td>${split[0] ?? ''}</td><td>${toLinks(element.sinonimi)}</td><td>${toLinks(element.contrari)}</td>`
        }
        tbody.append(rowElement);
    }
    for (let el of tbody.getElementsByTagName('a')) {
        el.setAttribute('href', '#');
        el.setAttribute('onclick', 'toSearch(this.innerHTML);runSearch(this.innerHTML);return false;');
    }
}

const data = fetch('./result.json')
    .then((response) => response.json())
    .then((json) => {
        loadedKeys = Object.keys(json);
        loadedJson = json;
        const onKeyup = (e) => {
            const inputValue = e.target.value;
            if (!inputValue || inputValue.length < 2) {
                tbody.innerHTML = '<tr><td>...</td><td>...</td><td>...</td></tr>';
                return;
            }
            runSearch(inputValue.toLowerCase());
        };
        input.addEventListener("keyup", debounce(onKeyup, 250));

        const url = new URL(window.location.href);
        const search = url.searchParams.get('search')
        if (search) {
            toSearch(search.toLowerCase());
            runSearch(search.toLowerCase());
            url.searchParams.delete('search');
            history.replaceState(history.state, '', url.href);
        }
    });
