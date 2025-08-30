// input text control class
class UpperText {
    constructor(obj) {
        // Default parameter object
        var defaultObj = {
            value: document,       // Element for user input
            entered: document,     // Element for correct text
            erroneous: document,   // Element for incorrect input
            upcoming: document,    // Element for remaining text
            rest: document,        // Element for rest text 
            line: obj.upcoming?.textContent || '', // Expected line of text
            getLine: ()=>["Lorem", "ipsum", "dolor", "sit", "amet"],    
        }

        // Merge default and user-defined parameters
        Object.assign(this, defaultObj, obj);

        // Initialize state variables
        this.a = 0;                // Index of correct input
        this.b = 0;                // Index of erroneous input
        this.timeoutId = null;     // Timer for delays
        this.lines = new Array();  // Array of row
        this.indexLine = 0;        // index of the current row
        
        // synonymous characters
        this.synonym = {"\u00A0": " ", "\u2002": " ", "\u2003": " ", "\u2009": " ", "\u202F": " ", "ё": "е", "Ё": "Е", "—": "-", "–": "-", "−": "-", "―": "-", "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ç": "c", "α": "a", "β": "b"};
        // symbols to replace 
        this.replaceSymbols = {" ":"\u00A0", "«": "\"", "»": "\"", "“": "\"", "”": "\"", "‘": "'", "’": "'", "×": "x", "÷": "/", "±": "+-", "∞": "inf", "π": "pi", "…": "...", "¡": "!", "¿": "?", "•": "*", "°": "deg", "№": "No", "©": "(c)", "®": "(r)", "™": "(tm)"};
        // regular regrowth
        this.re = {
            replaceSymbols: new RegExp(Object.keys(this.replaceSymbols).join("|"), "g")
        }

        // update lines 
        this.switchLine();
    }

    // Update displayed text areas
    switchStatus(a = this.a, b = this.b) {
        this.a = a;
        this.b = b;

        this.entered.textContent = this.line.slice(0, a);
        this.erroneous.textContent = this.line.slice(a, b);
        this.upcoming.textContent = this.line.slice(b);
    }
    
    // Update input status
    update() { 
        const len = this.value.textContent.length; 

        // Reset if no input
        if (len === 0) {
            this.reset(); 
            return;
        }

        const toSynonym = char=>char in this.synonym ? this.synonym[char] : char;
        const char1 = toSynonym(this.value.textContent.at(len - 1));
        const char2 = toSynonym(this.line.at(len - 1));


        // If the character is correct
        if (char1 === char2 && this.a >= this.b) { // if it is correct and there is no zone with an error
            this.switchStatus(len, len);
            // end line
            if (len === this.line.length) this.switchLine(); 
        } 

        // If the character is incorrect
        else { 
            this.switchStatus(this.a, len);
            if (settings.isAutoBackspace) this.autoBackspace(); 
            else if (this.a === this.b) {}// on error of manually
        }
    }

    reset() {
        this.switchStatus(0, 0);
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.value.textContent = '';
    }

    autoBackspace() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.switchStatus(this.a, this.a);  
            this.value.textContent = this.entered.textContent;
            this.timeoutId = null;
        }, 200);
    }

    // switch the line
    async switchLine() {
        // if end of text
        if (this.lines.length <= this.indexLine) {
            this.lines = await this.getLine();
            this.indexLine = 0;
        }
        // update row
        // update one line
        this.line = this.lines[this.indexLine]
            .replace(this.re.replaceSymbols, 
                symbol=>this.replaceSymbols[symbol]
            );

        // if there are more lines
        if (this.lines.length > this.indexLine + 1) { 
            this.rest.innerHTML = this.lines
                .slice(this.indexLine + 1, this.indexLine + 5)
                .join("<br>");
        } else this.rest.innerHTML = ``;
        // reset text area
        this.reset();
        // switch the current row
        this.indexLine++;
    }
}

var upperText = new UpperText({
    value: document.querySelector('#input-value'),
    entered: document.querySelector('#entered-text'),
    erroneous: document.querySelector('#erroneous-text'),
    upcoming: document.querySelector('#upcoming-text'),
    rest: document.querySelector('#rest-text'),
    getLine: ()=>getText.getText().then(text=>textToLine.updateLines(text)),
    // line: 'value this for test'
});
