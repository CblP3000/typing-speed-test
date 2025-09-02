// input text control class
class UpperText {
    constructor(options) {
        // Merge default and user-defined parameters
        Object.assign(this, {
            optionalReset: ()=>{},
            toSynonym: char=>char,
            switchLine: ()=>{},
            autoBackspace: ()=>{},
        }, options);

        this.a = 0;                // Index of correct input
        this.b = 0;                // Index of erroneous input
        this.line = elements.upcoming?.textContent || '' // Expected line of text 

        // update lines 
        this.switchLine();
    }

    // Update displayed text areas
    switchStatus(a = this.a, b = this.b) {
        this.a = a;
        this.b = b;

        elements.entered.textContent = this.line.slice(0, a);
        elements.erroneous.textContent = this.line.slice(a, b);
        elements.upcoming.textContent = this.line.slice(b);
    }

    reset() {
        this.switchStatus(0, 0);
        elements.value.textContent = '';
        this.optionalReset();
    }
    
    // Update input status
    update() { 
        const len = elements.value .textContent.length; 

        // Reset if no input
        if (len === 0) {
            this.reset(); 
            return;
        }

        if (this.a === 0) this.onStartTyping();

        const char1 = this.toSynonym(elements.value .textContent.at(len - 1));
        const char2 = this.toSynonym(this.line.at(len - 1));


        // If the character is correct
        if (char1 === char2 && this.a >= this.b) { // if it is correct and there is no zone with an error
            this.switchStatus(len, len);
            // end line
            if (len === this.line.length) {
                this.onEndLine(this.line);
                this.switchLine();
            } 
        } 

        // If the character is incorrect
        else { 
            this.switchStatus(this.a, len);
            if (settings.isAutoBackspace) this.autoBackspace(this.onError); 
            else if (this.a >= this.b) this.onError();   // on error of manually
        }
    }
}

class SwitchLine {
    constructor(options) {
        Object.assign(this, {
            getLine: ()=>["GetLine", "is not", "define"],
            replaceSynonym: str=>str,
        }, options)
        this.lines = new Array();  // Array of row
        this.indexLine = 0;        // index of the current row

        this.switch = this.switch.bind(this);
    }

    // switch the line
    async switch() {
        // if end of text
        if (this.lines.length <= this.indexLine) {
            this.lines = await this.getLine();
            this.indexLine = 0;
        }
        // update row
        // update one line
        upperText.line = this.replaceSynonym(this.lines[this.indexLine]);


        // if there are more lines
        if (this.lines.length > this.indexLine + 1) { 
            elements.rest.innerHTML = this.lines
                .slice(this.indexLine + 1, this.indexLine + 5)
                .join("<br>");
        } else elements.rest.innerHTML = ``;
        // reset text area
        upperText.reset();
        // switch the current row
        this.indexLine++;
    }
}

class SynonymCharacters {
    constructor() {
        // synonymous characters
        this.synonym = {"\u00A0": " ", "\u2002": " ", "\u2003": " ", "\u2009": " ", "\u202F": " ", "ё": "е", "Ё": "Е", "—": "-", "–": "-", "−": "-", "―": "-", "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ç": "c", "α": "a", "β": "b"};
        // symbols to replace 
        this.replaceSymbols = {" ":"\u00A0", "«": "\"", "»": "\"", "“": "\"", "”": "\"", "‘": "'", "’": "'", "×": "x", "÷": "/", "±": "+-", "∞": "inf", "π": "pi", "…": "...", "¡": "!", "¿": "?", "•": "*", "°": "deg", "№": "No", "©": "(c)", "®": "(r)", "™": "(tm)"};
        
        // regular regrowth
        this.re = {
            replaceSymbols: new RegExp(Object.keys(this.replaceSymbols).join("|"), "g")
        }

        this.toSynonym = this.toSynonym.bind(this);
        this.replace = this.replace.bind(this);
    }

    toSynonym = char => char in this.synonym ? this.synonym[char] : char;

    replace = str => 
        str.replace(this.re.replaceSymbols, 
            symbol=>this.replaceSymbols[symbol]
        );


}


class AutoBackspace {
    constructor() {
        this.timeoutId = null;     // Timer for delays
        this.delay = 200;          // Delay for Backspace 

        this.backspace = this.backspace.bind(this);
        this.reset = this.reset.bind(this);
    }

    backspace(onClear = ()=>{}) {
        if (this.timeoutId) 
            clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            upperText.switchStatus(upperText.a, upperText.a);  
            elements.value.textContent = elements.entered.textContent;
            onClear();
            this.timeoutId = null;
        }, this.delay);
    }

    reset() {
        if (this.timeoutId)
            clearTimeout(this.timeoutId);
    }
}

var synonymCharacters = new SynonymCharacters();
var switchLine = new SwitchLine({
    getLine: ()=>getText.getText().then(text=>textToLine.updateLines(text)),
    replaceSynonym: synonymCharacters.replace,
});
var autoBackspace = new AutoBackspace();

var upperText = new UpperText({
    optionalReset: ()=>autoBackspace.reset,
    toSynonym: synonymCharacters.toSynonym,
    switchLine: switchLine.switch,
    autoBackspace: autoBackspace.backspace,
    onStartTyping: statistics.start,
    onError: statistics.error,
    onEndLine: statistics.endLine
});
