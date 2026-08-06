(function () {
  var script = document.currentScript;
  var clientId = script && script.getAttribute('data-client-id');
  if (!clientId) { console.warn('[AGENTIC widget] data-client-id is missing.'); return; }

  var baseUrl = script ? new URL(script.src).origin : '';
  var chatUrl = baseUrl + '/chat/' + clientId;
  var SESSION_KEY = 'agentic_widget_open_' + clientId;

  var ICON_EXPAND   = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_COMPRESS = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 14h6m0 0v6m0-6l-7 7M20 10h-6m0 0V4m0 6l7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ── Styles ── */
  var style = document.createElement('style');
  style.textContent = [
    '#agentic-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;',
    'background:linear-gradient(135deg,#4F8CFF,#A855F7);border:none;cursor:pointer;z-index:9999;',
    'box-shadow:0 4px 20px rgba(79,140,255,0.45);display:flex;align-items:center;justify-content:center;',
    'transition:transform 0.2s,box-shadow 0.2s;}',
    '#agentic-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(79,140,255,0.6);}',

    '#agentic-popup{position:fixed;bottom:92px;right:24px;width:380px;height:560px;z-index:9998;',
    'border-radius:20px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,0.55);',
    'display:none;flex-direction:column;',
    'transition:width 0.3s ease,height 0.3s ease,bottom 0.3s ease,right 0.3s ease,border-radius 0.3s ease;}',

    '#agentic-popup.ag-expanded{width:96vw;height:92dvh;bottom:2dvh;right:2vw;border-radius:16px;}',

    '#agentic-popup iframe{width:100%;flex:1;border:none;}',

    /* control bar */
    '#agentic-controls{position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:2;}',
    '#agentic-expand,#agentic-close{background:rgba(255,255,255,0.12);border:none;color:#fff;',
    'width:28px;height:28px;border-radius:50%;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;transition:background 0.2s;}',
    '#agentic-expand:hover,#agentic-close:hover{background:rgba(255,255,255,0.25);}',

    '@keyframes agSlideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}',

    '@media(max-width:479px){',
    '#agentic-popup,#agentic-popup.ag-expanded{width:100vw;height:100dvh;bottom:0;right:0;border-radius:0;}',
    '#agentic-btn{bottom:20px;right:20px;}',
    '}',
  ].join('');
  document.head.appendChild(style);

  /* ── Trigger button ── */
  var btn = document.createElement('button');
  btn.id = 'agentic-btn';
  btn.setAttribute('aria-label', 'Open chat assistant');
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);

  /* ── Popup ── */
  var popup = document.createElement('div');
  popup.id = 'agentic-popup';

  /* Control bar: expand + close */
  var controls = document.createElement('div');
  controls.id = 'agentic-controls';

  var expandBtn = document.createElement('button');
  expandBtn.id = 'agentic-expand';
  expandBtn.setAttribute('aria-label', 'Expand chat');
  expandBtn.innerHTML = ICON_EXPAND;
  controls.appendChild(expandBtn);

  var closeBtn = document.createElement('button');
  closeBtn.id = 'agentic-close';
  closeBtn.setAttribute('aria-label', 'Close chat');
  closeBtn.innerHTML = '&#10005;';
  controls.appendChild(closeBtn);

  popup.appendChild(controls);

  var iframe = document.createElement('iframe');
  iframe.src = chatUrl;
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'AI Chat Assistant');
  popup.appendChild(iframe);

  document.body.appendChild(popup);

  /* ── State ── */
  var isExpanded = false;

  function openPopup() {
    popup.style.display = 'flex';
    popup.style.animation = 'agSlideIn 0.25s ease-out both';
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  function closePopup() {
    popup.style.display = 'none';
    sessionStorage.removeItem(SESSION_KEY);
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
    if (isExpanded) {
      popup.classList.add('ag-expanded');
      expandBtn.innerHTML = ICON_COMPRESS;
      expandBtn.setAttribute('aria-label', 'Collapse chat');
    } else {
      popup.classList.remove('ag-expanded');
      expandBtn.innerHTML = ICON_EXPAND;
      expandBtn.setAttribute('aria-label', 'Expand chat');
    }
  }

  btn.addEventListener('click', function () {
    popup.style.display === 'flex' ? closePopup() : openPopup();
  });

  closeBtn.addEventListener('click', closePopup);
  expandBtn.addEventListener('click', toggleExpand);

  /* Restore state on page load */
  if (sessionStorage.getItem(SESSION_KEY)) {
    popup.style.display = 'flex';
  }
})();
