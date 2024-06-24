const Timer = document.getElementById("timer")

export class StopWatch {
    constructor() {
        this.id = null;
        this.secondsSpend = 0;
        this.isStarted = false;
    }

    start() {
        this.secondsSpend = 0;
        this.isStarted = true
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

export function showTimer(timer) {
    Timer.innerText = `${timer.secondsSpend/60} : ${timer.secondsSpend%60}`
}