import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;

const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;
const dateInput = document.querySelector('#datetime-picker');

const timer = {
  deadline: null,
  intervalId: null,
  refs: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },

  start() {
    if (!this.deadline) return;

    this.intervalId = setInterval(() => {
      const diff = this.deadline - Date.now();

      if (diff <= 0) {
        this.stop();

        return;
      }

      const { days, hours, minutes, seconds } = this.convertMs(diff);

      this.refs.days.textContent = this.pad(days);
      this.refs.hours.textContent = this.pad(hours);
      this.refs.minutes.textContent = this.pad(minutes);
      this.refs.seconds.textContent = this.pad(seconds);
    }, 1000);

    startBtn.disabled = true;
    dateInput.disabled = true;
  },

  stop() {
    clearInterval(this.intervalId);
    dateInput.disabled = false;
    startBtn.disabled = true;
  },

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },
};

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= Date.now()) {
      iziToast.show({
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      startBtn.disabled = false;
    }
  },
});

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  timer.deadline = userSelectedDate;
  timer.start();
});
