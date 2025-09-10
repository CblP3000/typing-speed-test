// saves and outputs statistics.
class Statistics {
    constructor() {
        // intial value
        this.errors = new AverageValue(10);
        this.speeds = new AverageValue(10);

        // bind the context 
        this.start = this.start.bind(this);
        this.error = this.error.bind(this);
        this.endLine = this.endLine.bind(this);

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
        
        this.speeds.push(speed);
        this.errors.push(errors);

        elements.speedValue.textContent = speed.toFixed(0);
        elements.errorValue.textContent = errors.toFixed(0);   
        
        elements.averageSpeedValue.textContent = this.speeds.average().toFixed(0);
        elements.averageErrorValue.textContent = this.errors.average().toFixed(0); 
    }
}

class AverageValue {
    constructor(sizeOfHistory = 10) {
        this.maxIndex = sizeOfHistory;
        this.list = new Array();
        this.amount = 0;
        this.index = 0;
    }

    push(value=0) {
        this.amount -= this.list[this.index] ?? 0;
        this.amount += value;
        this.list[this.index] = value;
        this.index = (this.index + 1) % this.maxIndex; 
    }

    average() {
        return (this.amount / this.list.length) || 0;
    }
}

const statistics = new Statistics();
