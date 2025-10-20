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
        
        this.loadText();
        this.getText = this.getText.bind(this) // bind the context
        this.loadText = this.loadText.bind(this);
    }

    async getText() {
        await this.promise;
        // saving the index of past saving
        const index = this.indexText;
        // saving the new text according to the new index
        this.loadText();
        // returning the previous text
        return this.texts[index];
    }

    loadText() {
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
        this.getKey = ()=>"index_path_" + packageOfTexts.getLang();
        this.loadIndex();
        this.get = this.get.bind(this);
        this.savingIndex = this.savingIndex.bind(this);
        this.loadIndex = this.loadIndex.bind(this);
    }

    get() {
        this.indexPath = (this.indexPath + 1) % packageOfTexts.getLength();
        return "text/" + packageOfTexts.lang + "/" + (this.indexPath + 1) + ".txt";
    }

    savingIndex() {
        localStorage.setItem(this.getKey(), this.indexPath-1); // -1 because there is a preloaded text
    }

    loadIndex() {
        this.indexPath = parseInt(
            localStorage.getItem(this.getKey())
        ) || 0;
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
        this.updateLines = this.updateLines.bind(this);
        this.wrap = this.wrap.bind(this);
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