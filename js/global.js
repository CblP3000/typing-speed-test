const $ = document.querySelector.bind(document);

const settings = {
    isAutoBackspace: true,
}

const elements = {
    value: $('#input-value'),          // Element for user input
    entered: $('#entered-text'),       // Element for correct text
    erroneous: $('#erroneous-text'),   // Element for incorrect input
    upcoming: $('#upcoming-text'),     // Element for remaining text
    rest: $('#rest-text'),             // Element for rest text 
    cursor: $('#input-cursor'),        // Element for text cursor 
    speedValue: $("#speed-value"),     // Element for speed in signs per minute
    errorValue: $('#errors-value'),    // Element for number of error in %
    spanElementForGetWidth: $("#span-element-for-get-width"),
}

const packageOfTexts = {
    langs: ['en', 'ru'],
    lang: 'ru',
    lengths: {
        "en": 0,
        "ru": 1815
    },
    setLang(index=0) {
        if (index < 0 || index >= this.langs.length) {
            console.warn('Incorrect language index');
            return;
        }
        this.lang = this.langs[index];
    },
    getLang() {
        return this.lang;
    },
    getLength() {
        return this.lengths[this.lang]
    }
};