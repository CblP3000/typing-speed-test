// saves and outputs statistics.
class Statistics {
    constructor(options) {
        Object.assign(this, {
        }, options);

        this.start = this.start.bind(this);
        this.error = this.error.bind(this);
        this.endLine = this.endLine.bind(this);

        this.reset();
    }

    start() {
        this.errorCount = 0;
        this.entered = 0;
        this.startTime = performance.now();
    }

    error() {
        this.errorCount++;
    }

    endLine(line) {
        this.endTime = performance.now(); // time 
        const difference = this.endTime - this.startTime;
        this.add(line, this.errorCount, difference);
    }

    reset() {
        this.errorCount = 0;
        this.entered = 0;
        this.startTime = null;
        this.endTime = null;
    }

    // adding and updating statistics results.
    // line - a string. error - the number of errors. time - writing time in ms.
    add(line, error, time) { 
        const speed = line.length/time*60000;
        const errors = error / line.length * 100;

        elements.speedValue.textContent = speed.toFixed(2);
        elements.errorValue.textContent = errors.toFixed(2);
    }

}

var statistics = new Statistics({
    
});
