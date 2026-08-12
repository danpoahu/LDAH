/* LDAH event first-launch popup — schedule-driven.
 *
 * Auto-shows once per browser, per event, on the homepage. Each event has a
 * 5-day window: the popup only appears in the 5 days leading up to (and on)
 * the event date, and shows ONLY that single upcoming date.
 *
 * Schedule:
 *   - Learning Labs · Navigating Transitions  — June 10  (window June 5–10)
 *   - Parent Talk Café                         — June 17  (window June 12–17)
 *   - Learning Labs · Understanding ADHD       — June 24  (window June 19–24)
 *   - Learning Labs · A-B-Cs of Advocacy       — July 8   (window July 3–8; hard stop 5 PM HST July 8)
 *   - Learning Labs · IDEA / Chapter 60        — Aug 12  (window Aug 7–12; hard stop 5 PM HST Aug 12)
 *
 * Behavior:
 *   - 5-day window: show only when 0 <= daysUntil <= 5. Picks the soonest
 *     eligible event. Outside every window, nothing shows.
 *   - Optional `endsAt` (ISO instant): hides a campaign at a precise time —
 *     e.g. the event's start — instead of waiting for its day to end.
 *   - Dismiss-once PER EVENT: localStorage 'll_popup_seen_<key>' is set on ANY
 *     close (X, backdrop, Escape, "Maybe later", Sign Up Now). Each event still
 *     pops once even if an earlier one was dismissed.
 *   - Self-hiding: once the last event's day passes, nothing ever shows again.
 *
 * To re-test from the console: LLEventPopup.reset(); location.reload();
 * (Preview a specific one: LLEventPopup.preview('ptc-2026-06-17'); )
 */
(function () {
    'use strict';

    var WINDOW_DAYS = 5;
    var SHOW_DELAY_MS = 1500;
    var KEY_PREFIX = 'll_popup_seen_';
    var MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
    var LL_IMG = 'https://firebasestorage.googleapis.com/v0/b/ldah-932d5.firebasestorage.app/o/event-images%2F1779995116728_June%20LL.jpg?alt=media&token=d0d2052f-feec-4e5f-a933-45c8a2ab66c0';
    var PTC_IMG = 'https://firebasestorage.googleapis.com/v0/b/ldah-932d5.firebasestorage.app/o/event-images%2F1780510227059_June%202026..jpg?alt=media&token=eedabbf6-206f-4493-b8af-376627649d43';
    var LL_JULY_IMG = 'https://firebasestorage.googleapis.com/v0/b/ldah-932d5.firebasestorage.app/o/event-images%2F1783039515710_July%20%20LL%202.jpg?alt=media&token=30236f21-a314-46bc-afa9-b5ed69f5149b';
    var LL_AUG_IMG = 'https://firebasestorage.googleapis.com/v0/b/ldah-932d5.firebasestorage.app/o/event-images%2F1784843405905_August.jpg?alt=media&token=07323c84-3b7d-4bd9-aee5-752e8dd2e43c';
    var MEMBER_IMG = 'become-a-member.png';

    // ── Schedule (edit here to add / change events) ───────────────────────────
    // label may contain "{month}" — replaced with the event's month name, so
    // "Learning Labs for {month}" auto-rolls June → July → … with the date.
    var CAMPAIGNS = [
        {
            key: 'll-2026-06-10',
            date: '2026-06-10',
            label: 'Learning Labs for {month}',
            sub: 'Free virtual Learning Lab for Hawaiʻi families.',
            topic: 'Navigating Transitions',
            when: 'June 10 &middot; 5:00 PM on Zoom',
            eventId: 'WyaBRKf0xhFsahAWgcbn',
            image: LL_IMG
        },
        {
            key: 'ptc-2026-06-17',
            date: '2026-06-17',
            label: 'Parent Talk Café',
            sub: 'A relaxed space for parents to connect and talk story.',
            topic: 'Parent Talk Café',
            when: 'June 17 &middot; 5:00 PM on Facebook',
            eventId: 'D9PCAWigmVKkXfMzHVJI',
            image: PTC_IMG
        },
        {
            key: 'll-2026-06-24',
            date: '2026-06-24',
            label: 'Learning Labs for {month}',
            sub: 'Free virtual Learning Lab for Hawaiʻi families.',
            topic: 'Understanding ADHD',
            when: 'June 24 &middot; 5:00 PM on Zoom',
            eventId: 'WyaBRKf0xhFsahAWgcbn',
            image: LL_IMG
        },
        {
            // August session 1 of 2. The default 5-day window (Aug 7-12) already
            // covers today, so no windowDays override is needed. endsAt stops it
            // the moment the session starts rather than letting it run out the
            // day: HST is UTC-10, so 5 PM HST Aug 12 == 2026-08-13T03:00:00Z.
            // Session 2 (Aug 26, Understanding Evaluations) is deliberately not
            // scheduled yet - the membership promo covers Aug 13-20.
            key: 'll-2026-08-12',
            date: '2026-08-12',
            endsAt: '2026-08-13T03:00:00Z',
            label: 'Learning Labs for {month}',
            sub: 'Free virtual Learning Lab for Hawaiʻi families.',
            topic: 'IDEA / Chapter 60',
            when: 'August 12 &middot; 5:00 PM on Zoom',
            eventId: 'IqTwpWFPtpONhThQZmzs',
            image: LL_AUG_IMG
        },
        {
            // Evergreen membership promo — replaces the event popup. Shows the
            // full flyer; the flyer AND the button link to the How to Help page.
            // NOTE: on the app, "How to Help" is its OWN page (howtohelp.html),
            // separate from Volunteer — unlike the W2 site where it is volunteer.html.
            key: 'become-member-2026-07',
            date: '2026-07-21',
            always: true,      // not date-windowed — shows whenever no event is active
            promo: true,
            image: MEMBER_IMG,
            alt: 'Become an LDAH Member',
            ctaText: 'Become a Member',
            ctaHref: 'howtohelp.html'
        }
    ];
    // ──────────────────────────────────────────────────────────────────────────

    var root = null;
    var activeCampaign = null;

    function flagKey(c) { return KEY_PREFIX + c.key; }
    function flagSet(c) {
        try { return localStorage.getItem(flagKey(c)) === 'true'; } catch (e) { return false; }
    }
    function setFlag(c) {
        try { localStorage.setItem(flagKey(c), 'true'); } catch (e) {}
    }

    // Local midnight for a 'YYYY-MM-DD' string (avoids UTC off-by-one).
    function midnight(ymd) {
        var p = ymd.split('-');
        return new Date(+p[0], +p[1] - 1, +p[2], 0, 0, 0, 0);
    }

    function daysUntil(ymd) {
        var now = new Date();
        var todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        return Math.round((midnight(ymd).getTime() - todayMid.getTime()) / 86400000);
    }

    // Soonest campaign that's within its 5-day window and not yet dismissed.
    function pickCampaign() {
        var best = null, bestDays = Infinity;
        var nowMs = Date.now();
        for (var i = 0; i < CAMPAIGNS.length; i++) {
            var c = CAMPAIGNS[i];
            var d = daysUntil(c.date);
            if (!c.always && (d < 0 || d > (typeof c.windowDays === 'number' ? c.windowDays : WINDOW_DAYS))) continue; // outside the show window; `always` promos skip the window entirely
            if (c.endsAt && nowMs >= Date.parse(c.endsAt)) continue; // past the hard cutoff (e.g. event start time)
            if (flagSet(c)) continue;               // already seen this one
            var rank = c.always ? 999 : d;          // a real upcoming event outranks an evergreen promo
            if (rank < bestDays) { best = c; bestDays = rank; }
        }
        return best;
    }

    function monthName(ymd) {
        return MONTHS[(+ymd.split('-')[1]) - 1];
    }
    function labelFor(c) {
        return c.label.replace('{month}', monthName(c.date));
    }
    function headline(c) {
        var d = daysUntil(c.date);
        var label = labelFor(c);
        if (d <= 0) return label + ' is today!';
        if (d === 1) return label + ' is tomorrow!';
        return d + ' days until ' + label;
    }

    function signupUrl(c) {
        // src=popup drives signup-source attribution (→ 'event-popup') on the events page.
        return 'events.html?eventId=' + c.eventId + '&autoOpen=1&src=popup';
    }

    function buildMarkup(c) {
        var backdrop = document.createElement('div');
        backdrop.className = 'll-pop-backdrop';
        backdrop.id = 'llPopBackdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        // Promo layout: the flyer IS the popup. Whole flyer + button link out.
        if (c.promo) {
            backdrop.innerHTML =
                '<div class="ll-pop ll-pop-promo" role="dialog" aria-modal="true" aria-label="' + (c.alt || 'Become a Member') + '">' +
                    '<button class="ll-pop-close" type="button" aria-label="Close">&times;</button>' +
                    '<a class="ll-pop-promo-link" href="' + c.ctaHref + '">' +
                        '<img class="ll-pop-promo-img" src="' + c.image + '" alt="' + (c.alt || '') + '">' +
                    '</a>' +
                    '<div class="ll-pop-promo-foot">' +
                        '<a class="ll-pop-cta" href="' + c.ctaHref + '">' + (c.ctaText || 'Learn More') + '</a>' +
                        '<button class="ll-pop-later" type="button">Maybe later</button>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(backdrop);
            return backdrop;
        }
        var imgTag = (c.image && c.image.toLowerCase().indexOf('.pdf') === -1)
            ? '<img class="ll-pop-img" src="' + c.image + '" alt="">'
            : '';
        backdrop.innerHTML =
            '<div class="ll-pop" role="dialog" aria-modal="true" aria-labelledby="llPopTitle">' +
                '<button class="ll-pop-close" type="button" aria-label="Close">&times;</button>' +
                '<div class="ll-pop-head">' +
                    '<h2 class="ll-pop-title" id="llPopTitle"></h2>' +
                '</div>' +
                imgTag +
                '<div class="ll-pop-body">' +
                    '<p class="ll-pop-sub">' + c.sub + '</p>' +
                    '<p class="ll-pop-when"><strong>' + c.topic + '</strong><br>' + c.when + '</p>' +
                    '<a class="ll-pop-cta" href="' + signupUrl(c) + '">Sign Up Now</a>' +
                    '<button class="ll-pop-later" type="button">Maybe later</button>' +
                '</div>' +
            '</div>';
        backdrop.querySelector('#llPopTitle').textContent = headline(c);
        document.body.appendChild(backdrop);
        return backdrop;
    }

    function show(c) {
        if (root) { root.remove(); root = null; }
        activeCampaign = c;
        root = buildMarkup(c);
        wire();
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // Any dismissal is permanent for THIS event (dismiss-once per event).
    function close() {
        if (activeCampaign) setFlag(activeCampaign);
        if (root) {
            root.classList.remove('active');
            root.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    }

    function wire() {
        root.querySelector('.ll-pop-close').addEventListener('click', close);
        root.querySelector('.ll-pop-later').addEventListener('click', close);
        // Sign Up Now: mark seen, then let the link navigate.
        root.querySelector('.ll-pop-cta').addEventListener('click', function () {
            if (activeCampaign) setFlag(activeCampaign);
        });
        var promoLink = root.querySelector('.ll-pop-promo-link');
        if (promoLink) promoLink.addEventListener('click', function () { if (activeCampaign) setFlag(activeCampaign); });
        root.addEventListener('click', function (ev) { if (ev.target === root) close(); });
        document.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape' && root && root.classList.contains('active')) close();
        });
    }

    /* ── Home rotation ───────────────────────────────────────────────────────
       Staff tick what they want shown in LDAH-Int (CMS > Home Rotation), which
       sets homeRotation:true. Those flyers rotate through this splash so a
       returning visitor is not shown the same one over and over.

       Priority is deliberate: a real dated event campaign always wins — if
       Learning Labs is on Tuesday, that is what should be on screen. Rotation
       fills the gaps that the evergreen membership promo used to fill alone.

       Seen-list lives in localStorage, not a cookie: a cookie would be sent to
       the server on every request for nothing. Per-browser, so someone on a
       phone and a laptop may see a repeat, which is fine. */
    var ROT_SEEN_KEY = 'ldah_home_seen';

    function rotSeen() {
        try { return JSON.parse(localStorage.getItem(ROT_SEEN_KEY) || '[]'); } catch (e) { return []; }
    }
    function rotMarkSeen(id) {
        try {
            var s = rotSeen(); s.push(id);
            localStorage.setItem(ROT_SEEN_KEY, JSON.stringify(s.slice(-60)));
        } catch (e) {}
    }

    function fetchRotation(cb) {
        if (typeof firebase === 'undefined' || !firebase.firestore) { cb([]); return; }
        try {
            var db = firebase.firestore();
            Promise.all([
                db.collection('events').get(),
                db.collection('recurringEvents').get()
            ]).then(function (snaps) {
                var out = [];
                snaps.forEach(function (snap) {
                    snap.forEach(function (doc) {
                        var v = doc.data() || {};
                        if (v.archived === true) return;
                        if (v.homeRotation !== true) return;  // only what staff ticked
                        if (!v.imageUrl) return;              // nothing to show without a flyer
                        out.push({ id: doc.id, title: v.title || 'LDAH', image: v.imageUrl });
                    });
                });
                // Sessions ticked individually count as separate items, so two
                // sessions of one Learning Labs doc rotate independently.
                snaps.forEach(function (snap) {
                    snap.forEach(function (doc) {
                        var v = doc.data() || {};
                        if (v.archived === true || !v.imageUrl) return;
                        (Array.isArray(v.homeRotationDates) ? v.homeRotationDates : []).forEach(function (lbl) {
                            out.push({ id: doc.id + '::' + lbl, title: (v.title || 'LDAH') + ' — ' + lbl, image: v.imageUrl });
                        });
                    });
                });
                cb(out);
            }).catch(function () { cb([]); });
        } catch (e) { cb([]); }
    }

    // Build a promo-shaped campaign from a rotation item so it reuses the flyer
    // layout that already exists, rather than inventing a second one.
    function rotationCampaign(items) {
        if (!items.length) return null;
        var seen = rotSeen();
        var unseen = items.filter(function (x) { return seen.indexOf(x.id) === -1; });
        if (!unseen.length) {                                  // full cycle — start again
            try { localStorage.removeItem(ROT_SEEN_KEY); } catch (e) {}
            unseen = items;
        }
        var pick = unseen[0];
        return {
            key: 'rotation-' + pick.id,
            date: '1970-01-01',
            always: true,
            promo: true,
            rotationId: pick.id,
            image: pick.image,
            alt: pick.title,
            ctaText: 'See our events',
            ctaHref: 'events.html'
        };
    }

    function init() {
        var c = pickCampaign();
        // A dated event campaign outranks everything. Only look at the rotation
        // when the alternative would be the evergreen promo or nothing at all.
        if (c && !c.always) { setTimeout(function () { show(c); }, SHOW_DELAY_MS); return; }
        fetchRotation(function (items) {
            var rot = rotationCampaign(items);
            var chosen = rot || c;
            if (!chosen) return;
            if (chosen.rotationId) rotMarkSeen(chosen.rotationId);
            setTimeout(function () { show(chosen); }, SHOW_DELAY_MS);
        });
    }

    window.LLEventPopup = {
        close: close,
        // Clear every event's seen-flag (so they can all re-pop).
        reset: function () {
            CAMPAIGNS.forEach(function (c) {
                try { localStorage.removeItem(flagKey(c)); } catch (e) {}
            });
            console.log('[LLEventPopup] all event flags cleared. Reload to retrigger.');
        },
        // Force-show a specific campaign by key, ignoring window + flag (testing only).
        preview: function (key) {
            var c = CAMPAIGNS.filter(function (x) { return x.key === key; })[0] || CAMPAIGNS[0];
            show(c);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
