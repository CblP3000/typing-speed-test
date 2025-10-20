class StatisticsValue {
    constructor(sizeOfHistory = 10, elementForValue, elementForAverageValue) {
        this.maxIndex = sizeOfHistory;
        this.element = elementForValue;
        this.elementAverage = elementForAverageValue;
        this.values = new Array();
        this.amount = 0;
        this.index = -1;
    }

    add(value=0) {
        // update average value
        this.index = (this.index + 1) % this.maxIndex; 
        this.amount -= this.values[this.index] ?? 0;
        this.values[this.index] = value;   
        this.amount += value;
        // pring the value
        this.element.textContent = value.toFixed(0);
        this.elementAverage.textContent = (this.amount / this.values.length).toFixed(0);
    }
}

const statistics = {
    speeds: new StatisticsValue(10, elements.speedValue, elements.averageSpeedValue),
    errors: new StatisticsValue(10, elements.errorValue, elements.averageErrorValue),
    startTime: null,
    errorCount: 0,
    // start typing
    start() { 
        this.errorCount = 0;
        this.startTime = performance.now();
    },
    // if you made a mistake
    error() {
        this.errorCount++;
    },
    // if you added a line
    endLine(line) {
        if (!line) return;
        const diff = Math.max(performance.now() - this.startTime, 1);
        this.speeds.add(line.length / diff * 60000);
        this.errors.add(this.errorCount / line.length * 100);
    },
}
