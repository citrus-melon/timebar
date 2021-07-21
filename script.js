/** @type {HTMLFormElement} */
const rangeControls = document.getElementById('range-controls');
const startInput = rangeControls.elements['start'];
const endInput = rangeControls.elements['end'];
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let start = end = null;

const tick = () => {
    const now = new Date();
    const value = (now-start)/(end-start);
    if (start !== null && end !== null && isFinite(value)) {
        progressBar.value = value;
        progressText.textContent = (value*100).toFixed(2) + '%';
    } else {
        progressBar.value = 0;
        progressText.textContent = '--%'
    }
}

const validateInput = (element) => {
    const newDate = new Date(element.value);
    if (isNaN(newDate.getTime())) {
        element.setCustomValidity('Please enter a valid date, ex. 7/16/2021');
        return null;
    } else {
        element.setCustomValidity('');
        return newDate;
    }
}

const saveOptions = () => {
    const params = new URLSearchParams(location.search);
    params.set('start', startInput.value);
    params.set('end', endInput.value);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);

    localStorage.setItem('start', startInput.value);
    localStorage.setItem('end', endInput.value);
}

startInput.addEventListener('input', (e) => {
    start = validateInput(startInput);
    saveOptions();
    tick();
});

endInput.addEventListener('input', (e) => {
    end = validateInput(endInput);
    saveOptions();
    tick();
});

const urlSearchParams = new URLSearchParams(window.location.search);
startInput.value = urlSearchParams.get('start') || localStorage.getItem('start') || startInput.value;
endInput.value = urlSearchParams.get('end') || localStorage.getItem('end') || endInput.value;
start = validateInput(startInput);
end = validateInput(endInput);

tick();
setInterval(tick, 1000);