export class StopWatch {
    constructor() {
        this.id = null;
        this.secondsSpend = 0;
    }

    start() {
        this.secondsSpend = 0;
        this.id = setInterval(() => {
            this.secondsSpend++;
        }, 1000);
    }

    pause() {
        clearInterval(this.id);
    }

    restart() {
        this.id = setInterval(() => {
            this.secondsSpend++;
        }, 1000);
    }

    stop() {
        clearInterval(this.id);
        this.secondsSpend = 0;
    }
}
