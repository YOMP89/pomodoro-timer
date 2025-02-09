class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60;
        this.breakTime = 5 * 60;
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkPhase = true;
        this.cycles = 0;
        this.timerId = null;

        // DOM elements
        this.timeDisplay = document.querySelector('.time-display');
        this.phaseDisplay = document.querySelector('.phase');
        this.startPauseButton = document.getElementById('startPause');
        this.resetButton = document.getElementById('reset');
        this.cyclesDisplay = document.getElementById('cycles');
        this.alarm = document.getElementById('alarm');

        // Event listeners
        this.startPauseButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.reset());

        // Load saved state
        this.loadState();
        this.updateDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        this.isRunning = true;
        this.startPauseButton.textContent = 'Pausar';
        this.timerId = setInterval(() => this.tick(), 1000);
    }

    pause() {
        this.isRunning = false;
        this.startPauseButton.textContent = 'Continuar';
        clearInterval(this.timerId);
        this.saveState();
    }

    reset() {
        this.pause();
        this.timeLeft = this.workTime;
        this.isWorkPhase = true;
        this.startPauseButton.textContent = 'Iniciar';
        this.updateDisplay();
        this.saveState();
    }

    tick() {
        this.timeLeft--;
        
        if (this.timeLeft < 0) {
            this.alarm.play();
            this.switchPhase();
        }

        this.updateDisplay();
        this.saveState();
    }

    switchPhase() {
        this.isWorkPhase = !this.isWorkPhase;
        if (this.isWorkPhase) {
            this.timeLeft = this.workTime;
        } else {
            this.timeLeft = this.breakTime;
            this.cycles++;
            this.cyclesDisplay.textContent = this.cycles;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.phaseDisplay.textContent = this.isWorkPhase ? 'Trabajo' : 'Descanso';
    }

    saveState() {
        const state = {
            timeLeft: this.timeLeft,
            isWorkPhase: this.isWorkPhase,
            cycles: this.cycles
        };
        localStorage.setItem('pomodoroState', JSON.stringify(state));
    }

    loadState() {
        const savedState = localStorage.getItem('pomodoroState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.timeLeft = state.timeLeft;
            this.isWorkPhase = state.isWorkPhase;
            this.cycles = state.cycles;
            this.cyclesDisplay.textContent = this.cycles;
        }
    }
}

// Inicializar la aplicación
const pomodoro = new PomodoroTimer();
