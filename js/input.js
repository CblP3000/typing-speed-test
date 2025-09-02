// click processing class
class Input {
    constructor(obj) {
        var defaultObj = {
            twinkleClass: 'twinkle',
            oninput: event => {}     // the handler is triggered after each line change.
        };
        Object.assign(this, defaultObj, obj);

        this.timeoutId = null;
        this.inithandler();
    }
    
    inithandler() {
        document.addEventListener('keydown', (event) => {
            // ctrl + backspace
            if (event.ctrlKey && event.key === 'Backspace') {
                const index = elements.value.textContent.lastIndexOf('\u00A0');
                elements.value.textContent = index === -1 ? '' : elements.value.textContent.slice(0, index);
            }
            // backspace
            else if (event.key === 'Backspace') elements.value .textContent = elements.value .textContent.slice(0, -1);
            // if it's not a regular key then exit
            else if (event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;
            // the whitespace
            else if (event.key === ' ') elements.value .textContent += '\u00A0'; 
            // adding symbol
            else elements.value .textContent += event.key;
            // removeing the twinkle class
            elements.cursor.classList.remove(this.twinkleClass);
            // adding the twinkle class after 200ms
            if (this.timeoutId) clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(()=> {
                elements.cursor.classList.add(this.twinkleClass);
                this.timeoutId = null;
            }, 200 );
            // this handler
            this.oninput(event);
        });
    }
}

var input = new Input({
    oninput: e=>{
        upperText.update(e);
    }
});
