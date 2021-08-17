// TICKING

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const tick = () => {
    if (start !== null && end !== null && start < end) {
        let now = new Date();
        if (now < start) now = start;
        let value = (now-start)/(end-start);
        progressBar.value = value;
        progressText.textContent = generateText(value, start, now, end);
    } else {
        progressBar.value = 0;
        progressText.textContent = '--'
    }
}

// TEXT DISPLAY

const textModeInput = document.getElementById('text-mode');
textModeInput.addEventListener('change', () => saveOptions());

const textGenerators = {};

textGenerators.percentComplete = (value) => (value*100).toFixed(2) + '%';
textGenerators.percentRemaining = (value) => ((1-value)*100).toFixed(2) + '%';
textGenerators.timeComplete = (value, start, now) => {
    let seconds = Math.abs(now - start) / 1000;
    let parts = [];

    const weeks = Math.floor(seconds / 604800);
    if (weeks) parts.push(`${weeks} week${weeks === 1 ? '' : 's'}`)
    seconds -= weeks * 604800;

    const days = Math.floor(seconds / 86400);
    if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`)
    seconds -= days * 86400;

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours) {
        parts.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    } else {
        parts.push(`${minutes.toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`)
    }

    let string = parts.join(', ');
    if (now < start) string = '-' + string;
    return string;
}
textGenerators.timeRemaining = (value, start, now, end) => textGenerators.timeComplete(value, now, end);
textGenerators.currentTime = (value, start, now) => now.toLocaleString();

const generateText = (...args) => textGenerators[textModeInput.value](...args);

// DATE RANGE

const rangeControls = document.getElementById('range-controls');
const startInput = rangeControls.elements['start'];
const endInput = rangeControls.elements['end'];

let start = end = null;

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

// CUSTOM TITLE

const customTitle = document.getElementById('custom-title');
const titleInput = document.getElementById('title-input');
const titleEditToggle = document.getElementById('title-edit-toggle');

titleEditToggle.addEventListener('click', () => {
    customTitle.classList.toggle('nodisplay');
    titleInput.classList.toggle('nodisplay');
    if (titleInput.classList.contains('nodisplay')) {
        titleEditToggle.textContent = 'edit';
    } else {
        titleEditToggle.textContent  = 'done'
    }
})

titleInput.addEventListener('change', () => {
    customTitle.textContent = titleInput.value;
    document.title = titleInput.value + ' - Timebar';
    saveOptions();
})


//SHARING

shareModal = document.getElementById('share-modal');
shareLink = document.getElementById('share-link');
copyLinkButton = document.getElementById('copy-link');
document.getElementById('share-button').addEventListener('click', () => {
    shareLink.value = location;
    shareModal.classList.toggle('nodisplay');
});
document.getElementById('share-modal-close').addEventListener('click', () => {
    shareModal.classList.add('nodisplay');
});
copyLinkButton.addEventListener('click', () => {
    shareLink.select();
    shareLink.setSelectionRange(0, shareLink.value.length);
    document.execCommand('copy');
    copyLinkButton.textContent = 'done';
    setTimeout(() => copyLinkButton.textContent = 'copy', 1000);
})

// URL PARAMETERS & LOCALSTORAGE

const saveOptions = () => {
    const params = new URLSearchParams(location.search);
    params.set('start', startInput.value);
    params.set('end', endInput.value);
    params.set('title', titleInput.value);
    params.set('textMode', textModeInput.value);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
    shareLink.value = location;

    localStorage.setItem('start', startInput.value);
    localStorage.setItem('end', endInput.value);
    localStorage.setItem('title', titleInput.value);
    localStorage.setItem('textMode', textModeInput.value);
}

const urlSearchParams = new URLSearchParams(window.location.search);
startInput.value = urlSearchParams.get('start') || localStorage.getItem('start') || startInput.value;
endInput.value = urlSearchParams.get('end') || localStorage.getItem('end') || endInput.value;
customTitle.textContent = titleInput.value = urlSearchParams.get('title') || localStorage.getItem('title') || titleInput.value;
textModeInput.value = urlSearchParams.get('textMode') || localStorage.getItem('textMode') || textModeInput.value;
document.title = titleInput.value + ' - Timebar';
start = validateInput(startInput);
end = validateInput(endInput);

// VISUAL THEME

const themeToggle = document.getElementById('theme-toggle');
let theme = localStorage.getItem('theme') || 'system';

const ICON_NAMES = {dark: 'dark_mode', light: 'light_mode', system: 'settings_suggest'};
const BUTTON_TITLES = {dark: 'Current theme: dark', light: 'Current theme: light', system: 'Current theme:system'};
const updateTheme = () => {
    themeToggle.textContent = ICON_NAMES[theme];
    themeToggle.title = BUTTON_TITLES[theme];

    if (theme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');

    if (theme === 'dark') document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
}

themeToggle.addEventListener('click', () => {
    if (theme === 'light') theme = 'system';
    else if (theme === 'dark') theme = 'light';
    else if (theme === 'system') theme = 'dark';
    localStorage.setItem('theme', theme);
    updateTheme();
});

updateTheme();

// FULLSCREEN

const fullscreenToggle = document.getElementById('fullscreen-toggle');
fullscreenToggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => fullscreenToggle.textContent = 'fullscreen_exit');
    } else {
        document.exitFullscreen().then(() => fullscreenToggle.textContent = 'fullscreen');
    }
});

// AUTOHIDE HEADER
const header = document.getElementById('header');
const hideHeader = () => header.classList.add('hidden');

let autohideTimeout = setTimeout(hideHeader, 2000);
document.addEventListener('mousemove', () => {
    header.classList.remove('hidden');
    clearTimeout(autohideTimeout);
    autohideTimeout = setTimeout(hideHeader, 2000);
})

// INITIALIZATION
tick();
setInterval(tick, 1000);