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
    averageSpeedValue: $("#average-speed-value"),
    averageErrorValue: $("#average-errors-value"),
    spanElementForGetWidth: $("#span-element-for-get-width"),
    languageSwitcher: $("#language-switcher-SP"),
    selectLang: $("#selected-lang"),
}

const packageOfTexts = {
    lang: 'ru',
    lengths: {
        "en": 2,
        "ru": 1815
    },
    
    setLang(lang) {
        if (this.lengths[lang]) {
            this.lang = lang;
            textPath.loadIndex();
            getText.loadText();
            switchLine.switchText();
        }
    },
    getLang() {
        return this.lang;
    },
    getLength() {
        return this.lengths[this.lang]
    }
};