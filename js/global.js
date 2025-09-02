var settings = {
    isAutoBackspace: false,
}

var elements = {
    value: document.querySelector('#input-value'),          // Element for user input
    entered: document.querySelector('#entered-text'),       // Element for correct text
    erroneous: document.querySelector('#erroneous-text'),   // Element for incorrect input
    upcoming: document.querySelector('#upcoming-text'),     // Element for remaining text
    rest: document.querySelector('#rest-text'),             // Element for rest text 
    cursor: document.querySelector('#input-cursor'),        // Element for text cursor 
    speedValue: document.querySelector("#speed-value"),     // Element for speed in signs per minute
    errorValue: document.querySelector('#errors-value'),     // Element for number of error in %
}
