let timer;
let isRunning = false;
let [hours, minutes, seconds, milliseconds] = [0, 0, 0, 0];
let laps = JSON.parse(localStorage.getItem('laps')) || [];
const timeDisplay = document.getElementById('time');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsContainer = document.getElementById('laps');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

function updateDisplay() {
  const format = (unit) => (unit < 10 ? `0${unit}` : unit);
  const formatMilliseconds = (unit) => unit.toString().padStart(3, '0');
  timeDisplay.innerText = `${format(hours)}:${format(minutes)}:${format(seconds)}.${formatMilliseconds(milliseconds)}`;
}

function startStop() {
  if (isRunning) {
    clearInterval(timer);
    startStopBtn.innerText = 'Start';
    lapBtn.disabled = true;
  } else {
    timer = setInterval(() => {
      milliseconds += 10;
      if (milliseconds >= 1000) {
        milliseconds = 0;
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
          if (minutes === 60) {
            minutes = 0;
            hours++;
          }
        }
      }
      updateDisplay();
      saveState();
    }, 10);
    startStopBtn.innerText = 'Stop';
    lapBtn.disabled = false;
  }
  isRunning = !isRunning;
}

function reset() {
  clearInterval(timer);
  [hours, minutes, seconds, milliseconds] = [0, 0, 0, 0];
  updateDisplay();
  startStopBtn.innerText = 'Start';
  isRunning = false;
  laps = [];
  lapBtn.disabled = true;
  renderLaps();
  saveState();
  localStorage.removeItem('laps');
}

function lap() {
  const lapTime = timeDisplay.innerText;
  laps.push(lapTime);
  renderLaps();
  saveState();
}

function renderLaps() {
  lapsContainer.innerHTML = '';
  laps.forEach((lap, index) => {
    const lapDiv = document.createElement('div');
    lapDiv.innerText = `Lap ${index + 1}: ${lap}`;
    lapsContainer.appendChild(lapDiv);
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  saveState();
}

function saveState() {
  const state = {
    time: { hours, minutes, seconds, milliseconds },
    isRunning,
    laps,
    isDarkMode: document.body.classList.contains('dark-mode'),
  };
  localStorage.setItem('stopwatchState', JSON.stringify(state));
}

function loadState() {
  const savedState = JSON.parse(localStorage.getItem('stopwatchState'));
  if (savedState) {
    ({ hours, minutes, seconds, milliseconds } = savedState.time);
    isRunning = savedState.isRunning;
    if (savedState.isRunning) {
      startStop();
    }
    if (savedState.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
    renderLaps();
    updateDisplay();
  }
}

startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);
toggleThemeBtn.addEventListener('click', toggleTheme);

window.addEventListener('load', loadState);
