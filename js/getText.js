// подбор и хронения текста.
class GetText {
    constructor(options) {
        Object.assign(this, {
            getPath: ()=>"getPath/is/not/defined"
        }, options);

        this.texts = new Array(2);
        this.indexText = 0;
        this.promise = null;

        // this.text = ()=> this.texts[this.indexText];
        // this.getText = url => fetch(url).then(e=>e.text(), console.error);
        
        this.updateText(); // bind the context

        this.getText = this.getText.bind(this)
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
        this.promise = fetch(this.getPath())
        .then(e=>e.text()) // response to text
        .then(text => {
            this.indexText = this.indexText === 1 ? 0 : 1; // switching the index
            this.texts[this.indexText] = text; // saving the new text
        })
        .catch(console.error);
    }
}

class TextPath {
    constructor() {
        this.key = "index_path";
        this.indexPath = parseInt(
            localStorage.getItem(this.key)
        ) || 0;
        this.source = `text/${packageOfTexts.getLang()}/`;

        this.get = this.get.bind(this);
    }

    get() {
        this.indexPath = (this.indexPath + 1) % packageOfTexts.getLength();
        localStorage.setItem(this.key, this.indexPath);
        return this.source + (this.indexPath + 1) + ".txt";
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
    }

    updateLines(text) { 
        const chunks = text.match(this.re.chunk) || [];
        let startOfLine = 0;
        let endOfLine = 0;  
        let lineLength = 0;
        let wordLength = 0;

        this.lines = new Array();
        const savingLine = ()=> this.lines.push(
            chunks.slice(startOfLine, endOfLine)
            .join('').trim()
        );

        for (; endOfLine < chunks.length; endOfLine++) {
            // wordLength = chunks[endOfLine].length;
            wordLength = this.getWidth(chunks[endOfLine]);
            lineLength += wordLength;
            if (lineLength > this.width || chunks[endOfLine] === `\n`) { 
                savingLine(); // saving line
                // reset value
                startOfLine = endOfLine;
                lineLength = wordLength; 
            }
        }     
        if (lineLength > 0) 
            savingLine(); // saving last line
        return this.lines;
    }

    wrap(text, options) {
        const textToLine = new TextToLine(options);
        textToLine.updateLines(text);
        return textToLine.lines.join(`\n`);
    }

    getWidth(text) {
        elements.spanElementForGetWidth.textContent = text;
        return elements.spanElementForGetWidth.clientWidth;
    }
}

const textPath = new TextPath();
const getText = new GetText({getPath: textPath.get});
const textToLine = new TextToLine({width: 500});