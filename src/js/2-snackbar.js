import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
  delay: document.querySelector('input[name="delay"]'),
};

refs.form.addEventListener('submit', makePromise);

function makePromise(event) {
  event.preventDefault();

  const delay = Number(refs.delay.value);
  const value = document.querySelector('input[name="state"]:checked')?.value;
  const shouldResolve = value === 'fulfilled';

  createPromise({ value, delay, shouldResolve })
    .then(() =>
      iziToast.show({
        message: `✅ Fulfilled promise in ${delay}ms`,
      })
    )
    .catch(() =>
      iziToast.show({
        message: `❌ Rejected promise in ${delay}ms`,
      })
    );
}

function createPromise({ value, delay, shouldResolve }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(value);
      } else {
        reject(value);
      }
    }, delay);
  });
}
