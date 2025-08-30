// saves and outputs statistics.
class Statistics {
    constructor(options) {
        Object.assign(this, {
            speedValue: document,
        }, options);

        this.reset();
    }

    // adding and updating statistics results.
    // line - a string. error - the number of errors. time - writing time in ms.
    add(line, error, time) { 
        // the plug
        console.log(`speed: ${line.length/time*60000}`); 
    }

    start() {
        console.log("start")
        this.errorCount = 0;
        this.entered = 0;
        this.startTime = performance.now();
    }

    error() {
        console.log("error")
        this.errorCount++;
    }

    endLine(line) {
        console.log("end line")
        this.endTime = performance.now(); // time 
        const difference = this.endTime - this.startTime;
        this.speedValue.textContent = line.length / difference*60000;
    }

    reset() {
        this.errorCount = 0;
        this.entered = 0;
        this.startTime = null;
        this.endTime = null;
    }
}

var statistics = new Statistics({
    speedvalue: document.querySelector("#speed-value")
});
