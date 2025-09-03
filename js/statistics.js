// saves and outputs statistics.
class Statistics {
    constructor() {
        // bind the context 
        this.start = this.start.bind(this);
        this.error = this.error.bind(this);
        this.endLine = this.endLine.bind(this);
        // intial value
        this.reset();
    }

    start() {
        this.reset();
        this.startTime = performance.now(); 
    }

    error() {
        this.errorCount++;
    }

    endLine(line) {
        this.endTime = performance.now();
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
        const speed = line.length / time * 60000;   // speed characters per minute
        const errors = error / line.length * 100;   // percentage of errors

        elements.speedValue.textContent = speed.toFixed(2);
        elements.errorValue.textContent = errors.toFixed(2);
    }
}

const statistics = new Statistics();
