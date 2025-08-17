var settings = {
    isAutoBackspace: true,
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
            else if (event.key === '') this.value.textContent += '\u00A0'; 
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
            line: obj.upcoming?.textContent || '', // Expected line of text
        }

        // Merge default and user-defined parameters
        Object.assign(this, defaultObj, obj);

        // Initialize state variables
        this.a = 0;                // Index of correct input
        this.b = 0;                // Index of erroneous input
        this.timeoutId = null;     // Timer for delays
        this.isError = false;      // Error flag
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
        // Reset if no input
        if (this.value.textContent === '') {
            this.reset(); 
            return;
        }

        const index = Math.max(this.value.textContent.length - 1, 0)
        const char1 = this.value.textContent.at(index);
        const char2 = this.line.at(index);


        // If the character is correct
        if (char1 === char2 && !this.isError) {
            this.a = this.value.textContent.length;
            this.switchStatus(this.a, this.a);
        } 

        // If the character is incorrect
        else { 
            this.b = this.value.textContent.length;
            this.switchStatus(this.a, this.b);
    
            if (settings.isAutoBackspace) this.autoBackspace(); 
            else this.isError = this.a < this.b; // if you write more then you guessed, then you made a mistake.
        }
    }

    reset() {
        this.switchStatus(0, 0);
        this.isError = false;
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.value.textContent = '';
    }

    autoBackspace() {
        this.isError = true;
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.switchStatus(this.a, this.a);  
            this.value.textContent = this.entered.textContent;
            this.timeoutId = null;
            this.isError = false;
        }, 200);
    }
}

// подбор и хронения текста.
class GetText {
    constructor() {
        this.puths = ["file_1.txt","file_2.txt","file_3.txt","file_4.txt","file_5.txt","file_6.txt","file_7.txt","file_8.txt","file_9.txt"];
        this.indexPuth = 0;
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
        if (this.indexPuth < this.puths.length) {
            this.promise = fetch(this.source + this.puths[this.indexPuth++])
            .then(e=>e.text()) // response to text
            .then(text => {
                this.indexText = this.indexText > 0 ? 0 : 1; // switching the index
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
        const chunk = text.match(this.re.chunk) || [];
        let startOfLine = 0;
        let endOfLine = 0;  
        let lineLength = 0;
        let wordLength = 0;

        const savingLine = ()=> this.lines.push(chunk.slice(startOfLine, endOfLine).join('').trim());

        for (; endOfLine < chunk.length; endOfLine++) {
            wordLength = chunk[endOfLine].length;
            // wordLength = this.getWidth(chunk[endOfLine]);
            lineLength += wordLength;
            if (lineLength > this.width) { 
                savingLine(); // saving line
                // reset value
                startOfLine = endOfLine;
                lineLength = wordLength;
            }
        }     
        if (lineLength) savingLine(); // saving last line
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
    }
}

// подбор и хронения текста.
class Text2 {
    constructor() {
        this.puths = [''];
        this.indexPuth = 0;
        this.source = 'text/';
        this.text = '';
    }

    async getText() {
        if (this.indexPuth < this.puths.length) {
            const response = await fetch(this.source + this.puths[this.indexPuth++]);
            if (response.ok) {
                return this.text = response.text()
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    async getText2() {
        if (this.indexPuth < this.puths.length) {
            return fetch(this.source + this.puths[this.indexPuth])
            .then(response=>{
                if (response.ok) {
                    return this.text = response.text()
                } else {
                    return '';
                }
            });
        } else {
            return '';
        }
    }
}


// сохраняет и выводит статистику.
class Statistics {
    // добовления и обновления результатов статистики.
    // line - строка. error - количество ошибок. time - время написания в мс.
    add(line, error, time) { 
        // the plug
        console.log(`speed: ${line.length/time*60000}`); 
    }
}

class Test {
    constructor() {
        
    }

    TextToLine() {
        const theClass = new TextToLine()
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const result = theClass.wrap(text, { width: 20 }); 
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
}


var upper_text = new UpperText({
    value: document.querySelector('#input-value'),
    entered: document.querySelector('#entered-text'),
    erroneous: document.querySelector('#erroneous-text'),
    upcoming: document.querySelector('#upcoming-text'),
    // line: 'value this for test'
});

var input = new Input({
    value: document.querySelector('#input-value'),
    cursor: document.querySelector('#input-cursor'),
    oninput: e=>upper_text.update(e)
});

var getText = new GetText();
var textToLine = new TextToLine();

var test = new Test();
console.log("result test 'TextToLine':", test.TextToLine());