var settings = {
    isAutoBackspace: false,
}

// класс оброботки нажатий
class Input {
    constructor(obj) {
        var defaultObj = {
            value: document,
            cursor: document,
            container: document,
            twinkleClass: 'twinkle',
            oninput: (event) => {}     // обработчик срабатывает после каждого изменения строки
        };
        Object.assign(this, defaultObj, obj);

        this.timeoutId = null;
        this.inithandler();
    }
    
    inithandler() {
        this.container.addEventListener('keydown', (event) => {
            // ctrl + backspace
            if (event.ctrlKey && event.key === 'Backspace') {
                const index = this.value.textContent.lastIndexOf('\u00A0');
                this.value.textContent = index ===-1 ? '' : this.value.textContent.slice(0, index);
            }
            // backspace
            else if (event.key === 'Backspace') this.value.textContent = this.value.textContent.slice(0, -1);
            // if it's not a regular key then exit
            else if (event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;
            // the whitespace
            else if (event.key === ' ') this.value.textContent += '\u00A0'; 
            // adding symbol
            else this.value.textContent += event.key;
            // removeing the twinkle class
            this.cursor.classList.remove(this.twinkleClass);
            // adding the twinkle class after 200ms
            if (this.timeoutId) clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(()=> {
                this.cursor.classList.add(this.twinkleClass);
                this.timeoutId = null;
            }, 200 );
            // this handler
            this.oninput(event);
        });
    }
}

// класс контроля вводимого текста
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

// подбор и хронения текста.
class GetText {
    constructor() {
        this.paths = ["file_2.txt","file_1.txt","file_3.txt","file_4.txt","file_5.txt","file_6.txt","file_7.txt","file_8.txt","file_9.txt"];
        this.indexPath = 0;
        this.source = 'jokes/';
        this.texts = new Array(2);
        this.indexText = 0;
        this.promise = null;

        // this.text = ()=> this.texts[this.indexText];
        // this.getText = url => fetch(url).then(e=>e.text(), console.error());
        
        this.updateText();
    }

    async getText() {
        await this.promise;
        // saving the index of past saving
        const index = this.indexText;
        // saving the new text according to the new index
        this.updateText();
        // returning the previous text
        return this.texts[index];
    }

    updateText = ()=> {
        if (this.indexPath < this.paths.length) {
            this.promise = fetch(this.source + this.paths[this.indexPath++])
            .then(e=>e.text()) // response to text
            .then(text => {
                this.indexText = this.indexText === 1 ? 0 : 1; // switching the index
                this.texts[this.indexText] = text; // saving the new text
            })
            .catch(console.error);
        }
    }
}

class TextToLine {
    constructor(options = {}) {
        this.lines = new Array();
        this.re = {
            chunk: /[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g,
        }

        Object.assign(this, {
            width: 200,
        }, options);
        
        this.initSpanElement();
    }

    updateLines(text) { 
        const chunks = text.match(this.re.chunk) || [];
        let startOfLine = 0;
        let endOfLine = 0;  
        let lineLength = 0;
        let wordLength = 0;

        this.lines = new Array();
        const savingLine = ()=> this.lines.push(chunks.slice(startOfLine, endOfLine).join('').trim());

        for (; endOfLine < chunks.length; endOfLine++) {
            wordLength = chunks[endOfLine].length;
            // wordLength = this.getWidth(chunk[endOfLine]);
            lineLength += wordLength;
            if (lineLength > this.width || chunks[endOfLine] === `\n`) { 
                savingLine(); // saving line
                // reset value
                startOfLine = endOfLine;
                lineLength = wordLength;
            }
        }     
        if (lineLength) savingLine(); // saving last line
        return this.lines;
    }

    wrap(text, options) {
        const textToLine = new TextToLine(options);
        textToLine.updateLines(text);
        return textToLine.lines.join(`\n`);
    }

    

    // пока ни как не использую
    getWidth(text, fontFamily = 'inherid', fontSize = 'inherid') {
        this.span.style.fontFamily = fontFamily;
        this.span.style.fontSize = fontSize;
        this.span.textContent = text;
        return this.span.offsetWidth;
    }

    initSpanElement() {
        const id = "span-element-for-get-width";
        this.span = document.getElementById(id);
        if (!this.span) {
            this.span = document.createElement('span');
            this.span.id = id;
            this.span.style = `visibility: hidden; position: absolute; white-space: pre;`;
            document.body.append(this.span);
        }
        this.span.textContent = ``;
    }
}

// сохраняет и выводит статистику.
class Statistics {
    constructor(options) {
        Object.assign(this, {
            speedValue: document,
        }, options);

        this.reset();
    }

    // добовления и обновления результатов статистики.
    // line - строка. error - количество ошибок. time - время написания в мс.
    add(line, error, time) { 
        // the plug
        console.log(`speed: ${line.length/time*60000}`); 
    }

    start() {
        console.log("start")
        this.errorCount = 0;
        this.entered = 0;
        this.startTime = performance.now();
    }

    error() {
        console.log("error")
        this.errorCount++;
    }

    endLine(line) {
        console.log("end line")
        this.endTime = performance.now(); // time 
        const difference = this.endTime - this.startTime;
        this.speedValue.textContent = line.length / difference*60000;
    }

    reset() {
        this.errorCount = 0;
        this.entered = 0;
        this.startTime = null;
        this.endTime = null;
    }
}

class Test {
    constructor() {
        // console.log("result test 'GetText':", this.GetText());   
        // console.log("result test 'TextToLine':", this.TextToLine());
    }

    TextToLine() {
        const theClass = new TextToLine()
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const result = theClass.wrap(text, { width: 20 }); 
        const outputData = `Lorem ipsum dolor\nsit amet,\nconsectetur\nadipiscing elit, sed\ndo eiusmod tempor\nincididunt ut labore\net dolore magna\naliqua.`;
        console.log(result);
        return result === outputData;
    }

    TextToLine2() {
        const theClass = new TextToLine({width: 20})
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const result = theClass.updateLines(text); 
        const outputData = `Lorem ipsum dolor\nsit amet,\nconsectetur\nadipiscing elit, sed\ndo eiusmod tempor\nincididunt ut labore\net dolore magna\naliqua.`;
        console.log(result);
        return result === outputData;
    }

    Wordwrap() {
        const wordwrap = new Wordwrap();
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        const result = wordwrap.wrap(text, { width: 20 })
        const outputData = `Lorem ipsum dolor\nsit amet,\nconsectetur\nadipiscing elit, sed\ndo eiusmod tempor\nincididunt ut labore\net dolore magna\naliqua.`;
        console.log(result);
        return result === outputData;
    }

    async GetText() {
        const theClass = new GetText();
        const text = `Скромная девушка приглашает парня в гости на чай. Он приходит с двумя бутылками коньяка. Она:
– Я же тебя на чай приглашала!
Он:
– Ну это… Ты сказала сама, что к чаю… это, где оно тут…
Вытаскивает из кармана замученную ириску:
– Вот! Конфеты с коньяком!`;
        await theClass.getText();
        const result = await theClass.getText();
        console.log(theClass.texts)
        console.log(result);
        return text === result;
    }
}


var statistics = new Statistics({
    speedvalue: document.querySelector("#speed-value")
});

var getText = new GetText();
var textToLine = new TextToLine({width: 50}); 

var upper_text = new UpperText({
    value: document.querySelector('#input-value'),
    entered: document.querySelector('#entered-text'),
    erroneous: document.querySelector('#erroneous-text'),
    upcoming: document.querySelector('#upcoming-text'),
    rest: document.querySelector('#rest-text'),
    getLine: ()=>getText.getText().then(text=>textToLine.updateLines(text)),
    // line: 'value this for test'
});

var input = new Input({
    value: document.querySelector('#input-value'),
    cursor: document.querySelector('#input-cursor'),
    oninput: e=>{
        upper_text.update(e);
    }
});

// console.log(textToLine.lines);

var test = new Test();