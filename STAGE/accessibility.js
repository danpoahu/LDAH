(function() {
    'use strict';

    if (document.getElementById('a11y-widget')) return;

    const STORAGE_KEY = 'ldah-a11y-settings';

    const defaultSettings = {
        textSize: 'normal',
        contrast: 'normal',
        readableFont: false,
        highlightLinks: false,
        largeCursor: false,
        reduceMotion: false,
        readingGuide: false
    };

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Could not save accessibility settings');
        }
    }

    let settings = loadSettings();

    // Inject CSS
    const styles = document.createElement('style');
    styles.textContent = `
/* Accessibility Panel Styles */
#a11y-widget {
    --a11y-primary: #004E7C;
    --a11y-primary-hover: #003a5c;
    --a11y-bg: #ffffff;
    --a11y-text: #333333;
    --a11y-border: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#a11y-panel {
    position: fixed;
    bottom: 72px;
    left: 10px;
    right: 10px;
    z-index: 99998;
    width: auto;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    background: var(--a11y-bg);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--a11y-border);
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
}

#a11y-panel.a11y-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.a11y-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--a11y-border);
    background: linear-gradient(135deg, var(--a11y-primary), #0066a1);
    border-radius: 16px 16px 0 0;
}

.a11y-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: white;
}

#a11y-close {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    font-size: 24px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    line-height: 1;
}

#a11y-close:hover {
    background: rgba(255,255,255,0.3);
}

#a11y-close:focus {
    outline: 2px solid white;
    outline-offset: 2px;
}

.a11y-options {
    padding: 20px;
}

.a11y-group {
    margin-bottom: 20px;
}

.a11y-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--a11y-text);
    margin-bottom: 10px;
}

.a11y-buttons {
    display: flex;
    gap: 8px;
}

.a11y-buttons button {
    flex: 1;
    padding: 10px 12px;
    border: 2px solid var(--a11y-border);
    background: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--a11y-text);
    cursor: pointer;
    transition: all 0.2s;
}

.a11y-buttons button:hover {
    border-color: var(--a11y-primary);
    color: var(--a11y-primary);
}

.a11y-buttons button:focus {
    outline: 2px solid var(--a11y-primary);
    outline-offset: 2px;
}

.a11y-buttons button.active {
    background: var(--a11y-primary);
    border-color: var(--a11y-primary);
    color: white;
}

.a11y-toggles {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.a11y-toggle-option {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 10px 12px;
    border-radius: 8px;
    transition: background 0.2s;
}

.a11y-toggle-option:hover {
    background: #f5f5f5;
}

.a11y-toggle-option input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: var(--a11y-primary);
    cursor: pointer;
}

.a11y-toggle-option span {
    font-size: 14px;
    color: var(--a11y-text);
}

.a11y-reset-btn {
    width: 100%;
    padding: 12px;
    background: #f0f0f0;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: background 0.2s;
}

.a11y-reset-btn:hover {
    background: #e0e0e0;
}

.a11y-reset-btn:focus {
    outline: 2px solid var(--a11y-primary);
    outline-offset: 2px;
}

#a11y-reading-guide {
    position: fixed;
    left: 0;
    right: 0;
    height: 40px;
    background: rgba(255, 255, 0, 0.2);
    border-top: 2px solid rgba(0, 78, 124, 0.5);
    border-bottom: 2px solid rgba(0, 78, 124, 0.5);
    pointer-events: none;
    z-index: 99990;
    display: none;
}

#a11y-reading-guide.active {
    display: block;
}

/* Bottom nav accessibility button style */
.nav-item.a11y-nav-btn {
    color: #1E90FF !important;
}
.nav-item.a11y-nav-btn svg {
    stroke: none;
    fill: #1E90FF;
}
.nav-item.a11y-nav-btn span {
    color: #1E90FF;
}
.nav-item.a11y-nav-btn.a11y-active {
    color: #0070E0 !important;
}
.nav-item.a11y-nav-btn.a11y-active svg {
    fill: #0070E0;
}

/* ===== ACCESSIBILITY MODIFICATIONS TO PAGE ===== */

html.a11y-text-large {
    font-size: 120% !important;
}

html.a11y-text-larger {
    font-size: 140% !important;
}

html.a11y-text-small {
    font-size: 90% !important;
}

html.a11y-contrast-high {
    filter: contrast(1.25);
}

html.a11y-contrast-high body {
    background: white !important;
}

html.a11y-contrast-high *:not(#a11y-widget):not(#a11y-widget *) {
    border-color: #000 !important;
}

html.a11y-contrast-dark {
    filter: invert(1) hue-rotate(180deg);
}

html.a11y-contrast-dark img,
html.a11y-contrast-dark video,
html.a11y-contrast-dark iframe,
html.a11y-contrast-dark [style*="background-image"] {
    filter: invert(1) hue-rotate(180deg);
}

html.a11y-readable-font * {
    font-family: Arial, Helvetica, sans-serif !important;
    letter-spacing: 0.03em !important;
    word-spacing: 0.1em !important;
    line-height: 1.6 !important;
}

html.a11y-highlight-links a {
    background: yellow !important;
    color: #000 !important;
    padding: 2px 4px !important;
    text-decoration: underline !important;
    outline: 2px solid #000 !important;
}

html.a11y-large-cursor,
html.a11y-large-cursor * {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='1' d='M5.5 3.21V20.8l5.71-5.71h5.5L5.5 3.21z'/%3E%3C/svg%3E") 0 0, auto !important;
}

html.a11y-reduce-motion *,
html.a11y-reduce-motion *::before,
html.a11y-reduce-motion *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
}
`;
    document.head.appendChild(styles);

    // Inject panel HTML (no floating toggle — triggered from bottom nav)
    const widget = document.createElement('div');
    widget.id = 'a11y-widget';
    widget.innerHTML = `
        <div id="a11y-panel" role="dialog" aria-label="Accessibility Settings">
            <div class="a11y-header">
                <h3>Accessibility</h3>
                <button id="a11y-close" aria-label="Close accessibility panel">&times;</button>
            </div>
            <div class="a11y-options">
                <div class="a11y-group">
                    <span class="a11y-label">Text Size</span>
                    <div class="a11y-buttons">
                        <button data-action="text-decrease" aria-label="Decrease text size">A-</button>
                        <button data-action="text-reset" aria-label="Reset text size">A</button>
                        <button data-action="text-increase" aria-label="Increase text size">A+</button>
                    </div>
                </div>
                <div class="a11y-group">
                    <span class="a11y-label">Contrast</span>
                    <div class="a11y-buttons">
                        <button data-action="contrast-normal" aria-label="Normal contrast">Normal</button>
                        <button data-action="contrast-high" aria-label="High contrast">High</button>
                        <button data-action="contrast-dark" aria-label="Dark mode">Dark</button>
                    </div>
                </div>
                <div class="a11y-toggles">
                    <label class="a11y-toggle-option">
                        <input type="checkbox" data-toggle="readable-font">
                        <span>Readable Font</span>
                    </label>
                    <label class="a11y-toggle-option">
                        <input type="checkbox" data-toggle="highlight-links">
                        <span>Highlight Links</span>
                    </label>
                    <label class="a11y-toggle-option">
                        <input type="checkbox" data-toggle="large-cursor">
                        <span>Large Cursor</span>
                    </label>
                    <label class="a11y-toggle-option">
                        <input type="checkbox" data-toggle="reduce-motion">
                        <span>Reduce Motion</span>
                    </label>
                    <label class="a11y-toggle-option">
                        <input type="checkbox" data-toggle="reading-guide">
                        <span>Reading Guide</span>
                    </label>
                </div>
                <button id="a11y-reset" class="a11y-reset-btn">Reset All Settings</button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // Reading guide element
    const readingGuide = document.createElement('div');
    readingGuide.id = 'a11y-reading-guide';
    document.body.appendChild(readingGuide);

    // Apply settings to page
    function applySettings() {
        const html = document.documentElement;

        html.classList.remove(
            'a11y-text-small', 'a11y-text-large', 'a11y-text-larger',
            'a11y-contrast-high', 'a11y-contrast-dark',
            'a11y-readable-font', 'a11y-highlight-links',
            'a11y-large-cursor', 'a11y-reduce-motion'
        );

        if (settings.textSize === 'large') html.classList.add('a11y-text-large');
        if (settings.textSize === 'larger') html.classList.add('a11y-text-larger');
        if (settings.textSize === 'small') html.classList.add('a11y-text-small');

        if (settings.contrast === 'high') html.classList.add('a11y-contrast-high');
        if (settings.contrast === 'dark') html.classList.add('a11y-contrast-dark');

        if (settings.readableFont) html.classList.add('a11y-readable-font');
        if (settings.highlightLinks) html.classList.add('a11y-highlight-links');
        if (settings.largeCursor) html.classList.add('a11y-large-cursor');
        if (settings.reduceMotion) html.classList.add('a11y-reduce-motion');

        readingGuide.classList.toggle('active', settings.readingGuide);

        updateUI();
        saveSettings(settings);
    }

    function updateUI() {
        document.querySelectorAll('[data-action^="contrast-"]').forEach(function(btn) {
            var action = btn.dataset.action.replace('contrast-', '');
            btn.classList.toggle('active', settings.contrast === action);
        });

        var toggleMap = {
            'readable-font': 'readableFont',
            'highlight-links': 'highlightLinks',
            'large-cursor': 'largeCursor',
            'reduce-motion': 'reduceMotion',
            'reading-guide': 'readingGuide'
        };

        document.querySelectorAll('[data-toggle]').forEach(function(checkbox) {
            var settingKey = toggleMap[checkbox.dataset.toggle];
            if (settingKey) {
                checkbox.checked = settings[settingKey];
            }
        });
    }

    var panel = document.getElementById('a11y-panel');
    var closeBtn = document.getElementById('a11y-close');
    var resetBtn = document.getElementById('a11y-reset');

    // Global toggle function called from bottom nav button
    window.toggleA11yPanel = function() {
        var isOpen = panel.classList.contains('a11y-open');
        panel.classList.toggle('a11y-open', !isOpen);
        // Update nav button state
        var navBtn = document.querySelector('.a11y-nav-btn');
        if (navBtn) navBtn.classList.toggle('a11y-active', !isOpen);
    };

    // Close panel
    closeBtn.addEventListener('click', function() {
        panel.classList.remove('a11y-open');
        var navBtn = document.querySelector('.a11y-nav-btn');
        if (navBtn) navBtn.classList.remove('a11y-active');
    });

    // Close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && panel.classList.contains('a11y-open')) {
            panel.classList.remove('a11y-open');
            var navBtn = document.querySelector('.a11y-nav-btn');
            if (navBtn) navBtn.classList.remove('a11y-active');
        }
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!panel.contains(e.target) && !e.target.closest('.a11y-nav-btn')) {
            if (panel.classList.contains('a11y-open')) {
                panel.classList.remove('a11y-open');
                var navBtn = document.querySelector('.a11y-nav-btn');
                if (navBtn) navBtn.classList.remove('a11y-active');
            }
        }
    });

    // Handle action buttons
    document.querySelectorAll('[data-action]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = btn.dataset.action;

            if (action === 'text-decrease') {
                if (settings.textSize === 'larger') settings.textSize = 'large';
                else if (settings.textSize === 'large') settings.textSize = 'normal';
                else if (settings.textSize === 'normal') settings.textSize = 'small';
            }
            if (action === 'text-increase') {
                if (settings.textSize === 'small') settings.textSize = 'normal';
                else if (settings.textSize === 'normal') settings.textSize = 'large';
                else if (settings.textSize === 'large') settings.textSize = 'larger';
            }
            if (action === 'text-reset') {
                settings.textSize = 'normal';
            }

            if (action === 'contrast-normal') settings.contrast = 'normal';
            if (action === 'contrast-high') settings.contrast = 'high';
            if (action === 'contrast-dark') settings.contrast = 'dark';

            applySettings();
        });
    });

    // Handle toggle checkboxes
    var toggleMap = {
        'readable-font': 'readableFont',
        'highlight-links': 'highlightLinks',
        'large-cursor': 'largeCursor',
        'reduce-motion': 'reduceMotion',
        'reading-guide': 'readingGuide'
    };

    document.querySelectorAll('[data-toggle]').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var settingKey = toggleMap[checkbox.dataset.toggle];
            if (settingKey) {
                settings[settingKey] = checkbox.checked;
                applySettings();
            }
        });
    });

    // Reset all
    resetBtn.addEventListener('click', function() {
        settings = { ...defaultSettings };
        applySettings();
    });

    // Reading guide follows mouse/touch
    document.addEventListener('mousemove', function(e) {
        if (settings.readingGuide) {
            readingGuide.style.top = (e.clientY - 20) + 'px';
        }
    });

    // Apply saved settings on load
    applySettings();
})();
