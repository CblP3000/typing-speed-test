// click processing class
class TextInput {
    constructor() {
        this.update = this.update.bind(this);
    }
    
    update(event) {
        // ctrl + backspace
        if (event.ctrlKey && event.key === 'Backspace') {
            const index = elements.value.textContent.lastIndexOf('\u00A0');
            elements.value.textContent = elements.value.textContent.slice(0, Math.max(index, 0));
        }
        // backspace
        else if (event.key === 'Backspace') elements.value.textContent = elements.value .textContent.slice(0, -1);
        // if it's not a regular key then exit
        else if (event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;
        // the whitespace
        else if (event.key === ' ') elements.value.textContent += '\u00A0'; 
        // adding symbol
        else elements.value.textContent += event.key;
    }
}

class FocusCursor {
    constructor({
        twinkleClass = 'twinkle', 
        delay = 200
    }) {
        this.twinkleClass = twinkleClass;
        this.delay = delay;
        this.timeoutId = null;
        this.focus = this.focus.bind(this);
    }

    focus() {
        // removeing the twinkle class
        elements.cursor.classList.remove(this.twinkleClass);
        // adding the twinkle class after delay
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(()=> {
            elements.cursor.classList.add(this.twinkleClass);
            this.timeoutId = null;
        }, this.delay );
    }
}

const focusCursor = new FocusCursor();
const textInput = new TextInput();

document.addEventListener('keydown', (event) => {
    // focus on cursor
    focusCursor.focus(event);
    // text input update
    textInput.update(event);
    // Update input status
    inputStatus.update(event);
});