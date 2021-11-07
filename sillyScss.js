
init();

function init() {

    const sheets = registerStylesheets();
    for (let i = 0; i < sheets.length; i++) { read(sheets[i]); }

    const styles = registerStylesheetsEmbedded();
    for (let i = 0; i < styles.length; i++) { compile(styles[i]); }

}

function read(url) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
            const basename = url.substring(url.lastIndexOf('/') + 1);
            const scssCode = xmlhttp.responseText;
            Sass.writeFile(basename, scssCode);
            compile('@import "' + basename + '"; ');
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function registerStylesheets() {
    const links = document.getElementsByTagName('link');
    let sheets = [];
    for (let i = 0; i < links.length; i++) { if (links[i].rel === 'stylesheet/scss') { sheets.push(links[i].href); } }
    return sheets;
};

function registerStylesheetsEmbedded() {
    const links = document.getElementsByTagName('style');
    let sheets = [];
    for (let i = 0; i < links.length; i++) { if (links[i].getAttribute('rel') === 'stylesheet/scss') { sheets.push(links[i].innerHTML); links[i].parentNode.removeChild(links[i]); } }
    return sheets;
};

function compile(scss) {
    const compiledScss = Sass.compile(scss);
    const styleDom = document.createElement('style');
    styleDom.innerHTML = compiledScss;
    document.body.appendChild(styleDom);
}