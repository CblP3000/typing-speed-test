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
    notifications: $("#container-notifications"),
    exampleNotification: $(".notification-ntf"),
    uploadedFiles: $("#input-element-for-upload-file"),
    themeSwitcher: $("#theme-switcher"),
}

const packageOfTexts = {
    lang: "ru",
    lengths: {
        "en": 76,
        "ru": 1815
    },
    keyLang: "language",
    
    setLang(lang) {
        if (this.lang !== lang && this.lengths[lang]) {
            this.lang = lang;
            localStorage.setItem(this.keyLang, this.lang)
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
    },
    constructor() {
        this.lang = localStorage.getItem(this.keyLang) || this.lang;
    }
};

packageOfTexts.constructor();