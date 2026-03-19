// Logo Story — LDAH App Version (home page only)
// First visit: cinematic reveal. Hover: quick tooltip. Double-click: replay.

(function () {
    var STORAGE_KEY = 'ldah-app-logo-story-seen';
    var PARAGRAPH_1 = 'The Hawaiian quilt symbolizes an attachment and a love for Hawai\u2018i, shared by people throughout the world.';
    var PARAGRAPH_2 = 'In our LDAH quilt design, the children are the center figures, those helping them achieve are the figures with open arms above the child, and the book/flower figures signify knowledge and growth.';

    var card = null;
    var overlay = null;
    var hoverTimer = null;
    var isShowingCinematic = false;
    var isShowingHover = false;

    function waitForLogo(cb) {
        var check = setInterval(function () {
            var logo = document.querySelector('img[src*="logo_transparent"]');
            if (logo) { clearInterval(check); cb(logo); }
        }, 200);
        setTimeout(function () { clearInterval(check); }, 10000);
    }

    function createElements() {
        overlay = document.createElement('div');
        overlay.className = 'logo-story-overlay';
        document.body.appendChild(overlay);

        card = document.createElement('div');
        card.className = 'logo-story-card';
        card.innerHTML =
            '<div class="logo-story-title">Our Logo Story</div>' +
            '<p class="logo-story-text" data-p="1">' + PARAGRAPH_1 + '</p>' +
            '<p class="logo-story-text" data-p="2">' + PARAGRAPH_2 + '</p>' +
            '<div class="logo-story-hint">double-click logo to see this again</div>';
        document.body.appendChild(card);
    }

    function positionCard(logo) {
        var rect = logo.getBoundingClientRect();
        var cardWidth = Math.min(380, window.innerWidth * 0.9);

        // Position below the logo, centered
        var left = rect.left + (rect.width / 2) - (cardWidth / 2);
        var top = rect.bottom + 12;

        if (left + cardWidth > window.innerWidth - 16) left = window.innerWidth - cardWidth - 16;
        if (left < 8) left = 8;

        card.style.left = left + 'px';
        card.style.top = top + 'px';
    }

    function showCinematic(logo) {
        if (isShowingCinematic) return;
        isShowingCinematic = true;
        hideHover();

        positionCard(logo);

        card.classList.remove('hover-mode');
        var texts = card.querySelectorAll('.logo-story-text');
        texts.forEach(function (t) { t.classList.remove('reveal', 'shimmer'); });

        // Spotlight the logo
        var logoLink = logo.closest('a');
        if (logoLink) logoLink.classList.add('logo-story-spotlight');

        overlay.classList.add('active');
        requestAnimationFrame(function () {
            card.classList.add('visible');
        });

        setTimeout(function () { texts[0].classList.add('reveal', 'shimmer'); }, 800);
        setTimeout(function () { texts[1].classList.add('reveal', 'shimmer'); }, 3000);

        var autoDismiss = setTimeout(function () { dismissCinematic(logo); }, 16000);

        function onDismiss(e) {
            if (e.target === logo || logo.contains(e.target)) return;
            clearTimeout(autoDismiss);
            dismissCinematic(logo);
            overlay.removeEventListener('click', onDismiss);
            card.removeEventListener('click', onDismiss);
        }
        overlay.addEventListener('click', onDismiss);
        card.addEventListener('click', onDismiss);
    }

    function dismissCinematic(logo) {
        if (!isShowingCinematic) return;
        card.classList.remove('visible');
        overlay.classList.remove('active');
        var logoLink = logo.closest('a');
        if (logoLink) logoLink.classList.remove('logo-story-spotlight');
        isShowingCinematic = false;
    }

    function showHover(logo) {
        if (isShowingCinematic || isShowingHover) return;
        isShowingHover = true;

        positionCard(logo);
        card.classList.add('hover-mode');

        var texts = card.querySelectorAll('.logo-story-text');
        texts.forEach(function (t) { t.classList.add('reveal'); t.classList.remove('shimmer'); });

        requestAnimationFrame(function () {
            card.classList.add('visible');
        });
    }

    function hideHover() {
        if (!isShowingHover) return;
        card.classList.remove('visible', 'hover-mode');
        isShowingHover = false;
    }

    function init(logo) {
        createElements();

        var logoLink = logo.closest('a');
        if (!logoLink) return;

        // Hover
        logoLink.addEventListener('mouseenter', function () {
            if (isShowingCinematic) return;
            hoverTimer = setTimeout(function () { showHover(logo); }, 800);
        });
        logoLink.addEventListener('mouseleave', function () {
            clearTimeout(hoverTimer);
            hideHover();
        });

        // Double-click: replay cinematic
        logoLink.addEventListener('dblclick', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showCinematic(logo);
        });

        // Single click: navigate home (delay to detect double-click)
        var clickTimer = null;
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (isShowingCinematic) return;
            if (clickTimer) return;
            clickTimer = setTimeout(function () {
                clickTimer = null;
                window.location.href = logoLink.href || 'index.html';
            }, 300);
        });
        logoLink.addEventListener('dblclick', function () {
            if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
        });

        // Mobile: long-press
        var longPressTimer = null;
        var longPressTriggered = false;
        logoLink.addEventListener('touchstart', function () {
            longPressTriggered = false;
            longPressTimer = setTimeout(function () {
                longPressTriggered = true;
                showCinematic(logo);
            }, 600);
        }, { passive: true });
        logoLink.addEventListener('touchend', function (e) {
            clearTimeout(longPressTimer);
            if (longPressTriggered) e.preventDefault();
        });
        logoLink.addEventListener('touchmove', function () {
            clearTimeout(longPressTimer);
        }, { passive: true });

        // First visit
        if (!localStorage.getItem(STORAGE_KEY)) {
            setTimeout(function () {
                showCinematic(logo);
                localStorage.setItem(STORAGE_KEY, Date.now());
            }, 1200);
        }

        window.addEventListener('scroll', function () {
            if (isShowingHover) positionCard(logo);
        }, { passive: true });
        window.addEventListener('resize', function () {
            if (isShowingHover || isShowingCinematic) positionCard(logo);
        });
    }

    waitForLogo(init);
})();
