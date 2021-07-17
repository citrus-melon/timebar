/** @type {HTMLFormElement} */
const rangeControls = document.getElementById('range-controls');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let start, end;

const tick = () => {
    const now = new Date();
    const value = (now-start)/(end-start);
    if (isFinite(value)) {
        progressBar.value = value;
        progressText.textContent = (value*100).toFixed(2) + '%';
    } else {
        progressBar.value = 0;
        progressText.textContent = '...%'
    }
}

const onChangeOptions = () => {
    const params = new URLSearchParams(location.search);
    params.set('start', rangeControls['start'].value);
    params.set('end', rangeControls['end'].value);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
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
    onChangeOptions();
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
    onChangeOptions();
}
rangeControls.elements['end'].addEventListener('input', onInputEnd);

const urlSearchParams = new URLSearchParams(window.location.search);
if (urlSearchParams.has('start')) rangeControls.elements['start'].value = urlSearchParams.get('start');
if (urlSearchParams.has('end')) rangeControls.elements['end'].value = urlSearchParams.get('end');

onInputStart();
onInputEnd();

setInterval(tick, 1000);