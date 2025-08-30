// click processing class
class Input {
    constructor(obj) {
        var defaultObj = {
            value: document,
            cursor: document,
            container: document,
            twinkleClass: 'twinkle',
            oninput: (event) => {}     // the handler is triggered after each line change.
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

var input = new Input({
    value: document.querySelector('#input-value'),
    cursor: document.querySelector('#input-cursor'),
    oninput: e=>{
        upperText.update(e);
    }
});
