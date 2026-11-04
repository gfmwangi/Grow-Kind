"use strict";

const SETTINGS_KEY = "studyTimerSettings";
const SOUND_KEY = "studyTimerSoundEnabled";
const RING_CIRCUMFERENCE = 2 * Math.PI * 88;

const elements = {
  timerDisplay: document.querySelector("#timerDisplay"),
  timerTime: document.querySelector("#timerTime"),
  timerCaption: document.querySelector("#timerCaption"),
  phaseBadge: document.querySelector("#phaseBadge"),
  progressRing: document.querySelector("#progressRing"),
  toggleButton: document.querySelector("#toggleButton"),
  resetButton: document.querySelector("#resetButton"),
  soundButton: document.querySelector("#soundButton"),
  soundButtonText: document.querySelector("#soundButtonText"),
  studyDuration: document.querySelector("#studyDuration"),
  breakDuration: document.querySelector("#breakDuration"),
  settingsForm: document.querySelector("#settingsForm"),
  settingsMessage: document.querySelector("#settingsMessage"),
  totalSessions: document.querySelector("#totalSessions"),
  todaySessions: document.querySelector("#todaySessions"),
  statsMessage: document.querySelector("#statsMessage")
};

const settings = loadSettings();
let soundEnabled = localStorage.getItem(SOUND_KEY) !== "false";
let audioContext;
let stats = { totalSessions: 0, todaySessions: 0 };

const timer = {
  phase: "study",
  remainingSeconds: settings.studyMinutes * 60,
  phaseLengthSeconds: settings.studyMinutes * 60,
  isRunning: false,
  hasStarted: false,
  endTime: null,
  intervalId: null
};

function loadSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return {
      studyMinutes: clampNumber(savedSettings?.studyMinutes, 25, 1, 180),
      breakMinutes: clampNumber(savedSettings?.breakMinutes, 5, 1, 60)
    };
  } catch (error) {
    return { studyMinutes: 25, breakMinutes: 5 };
  }
}

function clampNumber(value, fallback, minimum, maximum) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum || number > maximum) {
    return fallback;
  }
  return number;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderTimer() {
  const phaseName = timer.phase === "study" ? "Study session" : "Break time";
  const progress = timer.phaseLengthSeconds > 0
    ? timer.remainingSeconds / timer.phaseLengthSeconds
    : 0;
  const ringOffset = RING_CIRCUMFERENCE * (1 - progress);

  document.body.dataset.phase = timer.phase;
  elements.timerTime.textContent = formatTime(timer.remainingSeconds);
  elements.timerDisplay.setAttribute(
    "aria-label",
    `${formatSpokenTime(timer.remainingSeconds)} remaining in ${phaseName.toLowerCase()}`
  );
  elements.phaseBadge.textContent = phaseName;
  elements.progressRing.style.strokeDasharray = String(RING_CIRCUMFERENCE);
  elements.progressRing.style.strokeDashoffset = String(ringOffset);

  if (timer.isRunning) {
    elements.timerCaption.textContent = timer.phase === "study"
      ? "Stay with this task"
      : "Take a moment to recharge";
    elements.toggleButton.textContent = "Pause";
  } else if (timer.hasStarted) {
    elements.timerCaption.textContent = "Timer paused";
    elements.toggleButton.textContent = "Resume";
  } else {
    elements.timerCaption.textContent = "Ready when you are";
    elements.toggleButton.textContent = "Start session";
  }
}

function formatSpokenTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} seconds`;
  if (seconds === 0) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return `${minutes} minutes and ${seconds} seconds`;
}

function startTimer() {
  if (timer.isRunning) return;

  prepareAudio();

  if (timer.remainingSeconds <= 0) {
    resetTimer();
  }

  timer.isRunning = true;
  timer.hasStarted = true;
  timer.endTime = Date.now() + timer.remainingSeconds * 1000;
  timer.intervalId = window.setInterval(updateCountdown, 250);
  renderTimer();
}

function updateCountdown() {
  const secondsLeft = Math.ceil((timer.endTime - Date.now()) / 1000);
  if (secondsLeft <= 0) {
    timer.remainingSeconds = 0;
    finishPhase();
    return;
  }
  timer.remainingSeconds = secondsLeft;
  renderTimer();
}

function pauseTimer() {
  if (!timer.isRunning) return;
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.isRunning = false;
  timer.remainingSeconds = Math.max(0, Math.ceil((timer.endTime - Date.now()) / 1000));
  renderTimer();
}

function resetTimer() {
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.isRunning = false;
  timer.hasStarted = false;
  timer.phase = "study";
  timer.phaseLengthSeconds = settings.studyMinutes * 60;
  timer.remainingSeconds = timer.phaseLengthSeconds;
  timer.endTime = null;
  renderTimer();
}

function finishPhase() {
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.isRunning = false;
  playNotification();

  if (timer.phase === "study") {
    saveCompletedSession();
    timer.phase = "break";
    timer.phaseLengthSeconds = settings.breakMinutes * 60;
  } else {
    timer.phase = "study";
    timer.phaseLengthSeconds = settings.studyMinutes * 60;
  }

  timer.remainingSeconds = timer.phaseLengthSeconds;
  timer.hasStarted = true;
  renderTimer();
  startTimer();
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderStats() {
  elements.totalSessions.textContent = String(stats.totalSessions);
  elements.todaySessions.textContent = String(stats.todaySessions);
}

async function loadStats() {
  try {
    const response = await fetch(`/api/stats?date=${getLocalDateKey()}`);
    if (!response.ok) throw new Error("Could not load session totals.");
    stats = await response.json();
    renderStats();
    elements.statsMessage.textContent = "Your totals are saved on this device.";
  } catch (error) {
    elements.statsMessage.textContent = "Could not load totals. Check that the app is running.";
  }
}

async function saveCompletedSession() {
  try {
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: getLocalDateKey() })
    });
    if (!response.ok) throw new Error("Could not save the completed session.");
    stats = await response.json();
    renderStats();
    elements.statsMessage.textContent = "Completed session saved.";
  } catch (error) {
    elements.statsMessage.textContent = "This session finished, but its total could not be saved.";
  }
}

function prepareAudio() {
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
  } catch (error) {
    // The timer still works if the browser blocks audio.
  }
}

async function playNotification() {
  if (!soundEnabled) return;

  try {
    prepareAudio();
    if (!audioContext) return;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, now);
    oscillator.frequency.setValueAtTime(880, now + 0.16);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.14, now + 0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.44);
  } catch (error) {
    // The timer still works if the browser blocks audio.
  }
}

function saveSettings(event) {
  event.preventDefault();

  const studyMinutes = Number(elements.studyDuration.value);
  const breakMinutes = Number(elements.breakDuration.value);
  if (!Number.isInteger(studyMinutes) || studyMinutes < 1 || studyMinutes > 180) return;
  if (!Number.isInteger(breakMinutes) || breakMinutes < 1 || breakMinutes > 60) return;

  settings.studyMinutes = studyMinutes;
  settings.breakMinutes = breakMinutes;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  resetTimer();
  elements.settingsMessage.textContent = "Timer lengths saved. The current timer has been reset.";
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem(SOUND_KEY, String(soundEnabled));
  prepareAudio();
  renderSoundButton();
}

function renderSoundButton() {
  elements.soundButton.setAttribute("aria-pressed", String(soundEnabled));
  elements.soundButtonText.textContent = soundEnabled ? "Sound on" : "Sound off";
}

function initialize() {
  elements.studyDuration.value = String(settings.studyMinutes);
  elements.breakDuration.value = String(settings.breakMinutes);
  elements.toggleButton.addEventListener("click", () => {
    if (timer.isRunning) pauseTimer();
    else startTimer();
  });
  elements.resetButton.addEventListener("click", resetTimer);
  elements.soundButton.addEventListener("click", toggleSound);
  elements.settingsForm.addEventListener("submit", saveSettings);

  renderTimer();
  renderSoundButton();
  renderStats();
  loadStats();
}

initialize();
