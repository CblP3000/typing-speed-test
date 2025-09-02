// подбор и хронения текста.
class GetText {
    constructor() {
        this.paths = ["file_2.txt","file_1.txt","file_3.txt","file_4.txt","file_5.txt","file_6.txt","file_7.txt","file_8.txt","file_9.txt"];
        this.indexPath = 0;
        this.source = '../text/';
        this.texts = new Array(2);
        this.indexText = 0;
        this.promise = null;

        // this.text = ()=> this.texts[this.indexText];
        // this.getText = url => fetch(url).then(e=>e.text(), console.error);
        
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

var getText = new GetText();
var textToLine = new TextToLine({width: 50});
