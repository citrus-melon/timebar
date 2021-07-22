// TICKING

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

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
const titleEditToggle = document.getElementById('title-edit-toggle')


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
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
    shareLink.value = location;

    localStorage.setItem('start', startInput.value);
    localStorage.setItem('end', endInput.value);
    localStorage.setItem('title', titleInput.value);
}

const urlSearchParams = new URLSearchParams(window.location.search);
startInput.value = urlSearchParams.get('start') || localStorage.getItem('start') || startInput.value;
endInput.value = urlSearchParams.get('end') || localStorage.getItem('end') || endInput.value;
customTitle.textContent = titleInput.value = urlSearchParams.get('title') || localStorage.getItem('title') || titleInput.value;
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

// CUSTOMIZABLE TITLE

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
    saveOptions();
})

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