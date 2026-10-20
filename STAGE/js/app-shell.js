/* LDAH app shell (STAGE, 2026-10-20): one header, menu and tab bar for every
   page, in the main website's look (site-theme.css).
   A page opts in with <body class="st-app" data-tab="home|events|help|resources|more"
   data-title="Events" data-back="index.html" data-back-label="Home">.
   data-title and data-back are optional: with no data-back the logo shows. */
(function () {
  'use strict';
  if (window.__stShell) return; window.__stShell = true;

  var STAGE = /\/STAGE\//.test(location.pathname);
  var MEMBERS = 'https://www.ldahawaii.org/' + (STAGE ? 'STAGE/' : '') + 'Members/?from=app';
  var DONATE = 'https://www.paypal.com/donate?hosted_button_id=F6F2DPC4D6RSA';
  var PACKET = 'https://www.ldahawaii.org/Packet/';

  var I = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    who: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    what: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
    events: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    people: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    chat: '<path d="M4 5h16v12H8l-4 3z"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
    a11y: '<circle cx="12" cy="4.5" r="1.6"/><path d="M5 8l7 1.5L19 8M12 9.5V15l-3 6M12 15l3 6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[k] + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var MENU = [
    { href: 'index.html', label: 'Home', icon: 'home' },
    { href: 'whoweare.html', label: 'Who We Are', icon: 'who' },
    { href: 'whatwedo.html', label: 'What We Do', icon: 'what' },
    { href: 'events.html', label: 'Events', icon: 'events' },
    { href: 'faq.html', label: 'Quick Help', icon: 'help', appOnly: true },
    { href: 'howtohelp.html', label: 'How to Help', icon: 'heart' },
    { href: 'volunteer.html', label: 'Volunteer', icon: 'people', sub: true },
    { href: 'resources.html', label: 'Resources', icon: 'search' },
    { href: 'contact.html', label: 'Contact', icon: 'chat' },
    { href: PACKET, label: 'Aloha Packet', icon: 'doc', ext: true },
    { action: 'a11y', label: 'Accessibility', icon: 'a11y' }
  ];
  var TABS = [
    { key: 'home', href: 'index.html', label: 'Home', icon: 'home' },
    { key: 'events', href: 'events.html', label: 'Events', icon: 'events' },
    { key: 'help', href: 'faq.html', label: 'Quick Help', icon: 'help' },
    { key: 'resources', href: 'resources.html', label: 'Resources', icon: 'search' },
    { key: 'more', action: 'menu', label: 'More', icon: 'menu' }
  ];

  function here() { var p = location.pathname.split('/').pop() || 'index.html'; return p; }

  function build() {
    var b = document.body;
    if (!b || !b.classList.contains('st-app') || document.getElementById('stAppbar')) return;
    var tab = b.getAttribute('data-tab') || '';
    var title = b.getAttribute('data-title') || '';
    var back = b.getAttribute('data-back') || '';
    var backLabel = b.getAttribute('data-back-label') || 'Back';
    var page = here();

    var bar = document.createElement('header');
    bar.className = 'st-appbar'; bar.id = 'stAppbar';
    bar.innerHTML = '<div class="st-appbar-in">' +
      (back ? '<a class="st-appbar-back" href="' + esc(back) + '">&lsaquo; ' + esc(backLabel) + '</a>'
            : '<a class="st-appbar-logo" href="index.html" aria-label="LDAH Home"><img src="logo_blue.png" alt="LDAH - Leadership in Disabilities and Achievement of Hawaiʻi"></a>') +
      '<div class="st-appbar-title">' + esc(title) + '</div>' +
      '<a class="st-appbar-donate" href="' + DONATE + '" target="_blank" rel="noopener">Donate</a>' +
      '<button class="st-burger" type="button" id="stBurger" aria-label="Open menu" aria-controls="stDrawer" aria-expanded="false"><i></i><i></i><i></i></button>' +
      '</div>';

    var scrim = document.createElement('div'); scrim.className = 'st-scrim'; scrim.id = 'stScrim';
    var dr = document.createElement('nav'); dr.className = 'st-drawer'; dr.id = 'stDrawer'; dr.setAttribute('aria-label', 'Menu'); dr.setAttribute('aria-hidden', 'true');
    dr.innerHTML = '<div class="st-drawer-top"><img src="logo_blue.png" alt=""><button class="st-drawer-close" type="button" id="stClose" aria-label="Close menu">&times;</button></div>' +
      MENU.map(function (m) {
        var cls = 'st-mi' + (m.sub ? ' st-mi-sub' : '') + (m.href === page ? ' on' : '');
        var tag = m.appOnly ? '<span class="st-app-only">APP</span>' : '';
        if (m.action) return '<button type="button" class="' + cls + '" data-act="' + m.action + '">' + svg(m.icon) + esc(m.label) + '</button>';
        return '<a class="' + cls + '" href="' + esc(m.href) + '"' + (m.ext ? ' target="_blank" rel="noopener"' : '') + '>' + (m.sub ? '' : svg(m.icon)) + esc(m.label) + tag + '</a>';
      }).join('') +
      '<div class="st-drawer-foot"><a class="st-btn st-btn-coral" href="' + DONATE + '" target="_blank" rel="noopener">Donate</a>' +
      '<a class="st-btn st-btn-secondary" href="' + MEMBERS + '">' + 'Member Login</a></div>';

    var tabs = document.createElement('nav'); tabs.className = 'st-tabs'; tabs.id = 'stTabs'; tabs.setAttribute('aria-label', 'Main navigation');
    tabs.innerHTML = '<div class="st-tabs-in">' + TABS.map(function (t) {
      var on = t.key === tab;
      var inner = svg(t.icon) + '<span>' + esc(t.label) + '</span><span class="st-dot"></span>';
      if (t.action) return '<button type="button" class="st-tab' + (on ? ' on' : '') + '" data-act="' + t.action + '" aria-label="' + esc(t.label) + '">' + inner + '</button>';
      return '<a class="st-tab' + (on ? ' on' : '') + '" href="' + t.href + '"' + (on ? ' aria-current="page"' : '') + '>' + inner + '</a>';
    }).join('') + '</div>';

    var a11y = document.createElement('button'); a11y.type = 'button'; a11y.className = 'st-a11y a11y-nav-btn'; a11y.setAttribute('aria-label', 'Accessibility options'); a11y.innerHTML = svg('a11y');

    b.insertBefore(bar, b.firstChild);
    b.appendChild(scrim); b.appendChild(dr); b.appendChild(tabs); b.appendChild(a11y);

    function setOpen(open) {
      dr.classList.toggle('open', open); scrim.classList.toggle('open', open);
      dr.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.getElementById('stBurger').setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var f = dr.querySelector('.st-mi'); if (f) f.focus(); }
    }
    function openA11y() { setOpen(false); if (typeof window.toggleA11yPanel === 'function') window.toggleA11yPanel(); }
    document.getElementById('stBurger').addEventListener('click', function () { setOpen(true); });
    document.getElementById('stClose').addEventListener('click', function () { setOpen(false); });
    scrim.addEventListener('click', function () { setOpen(false); });
    a11y.addEventListener('click', openA11y);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dr.classList.contains('open')) setOpen(false); });
    [dr, tabs].forEach(function (root) {
      root.addEventListener('click', function (e) {
        var t = e.target.closest('[data-act]'); if (!t) return;
        var act = t.getAttribute('data-act');
        if (act === 'menu') setOpen(true);
        if (act === 'a11y') openA11y();
      });
    });
    window.stOpenMenu = function () { setOpen(true); };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
