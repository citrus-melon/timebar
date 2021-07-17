/** @type {HTMLFormElement} */
const rangeControls = document.getElementById('range-controls');
const progressBar = document.getElementById('progress-bar');

let start, end;

const tick = () => {
    const now = new Date();
    const value = (now-start)/(end-start);
    if (isFinite(value)) {
        progressBar.value = value;
    } else {
        progressBar.value = 0;
    }
}

const onInputStart = () => {
    const element = rangeControls.elements['start'];
    const newDate = new Date(element.value);
    if (isNaN(newDate.getTime())) {
        element.setCustomValidity('Please enter a valid date, ex. 7/16/2021');
    } else {
        start = newDate;
        element.setCustomValidity('');
    }
}
rangeControls.elements['start'].addEventListener('input', onInputStart);

const onInputEnd = () => {
    const element = rangeControls.elements['end'];
    const newDate = new Date(element.value);
    if (isNaN(newDate.getTime())) {
        element.setCustomValidity('Please enter a valid date, ex. 7/16/2021');
    } else {
        end = newDate;
        element.setCustomValidity('');
    }
}
rangeControls.elements['end'].addEventListener('input', onInputEnd);

onInputStart();
onInputEnd();

setInterval(tick, 1000);