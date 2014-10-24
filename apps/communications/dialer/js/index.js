/* globals KeypadManager, NavbarManager, LazyLoader, LazyL10n, CallHandler,
           performance */
'use strict';

window.addEventListener('load', function dialerSetup() {
  // Dialer chrome UI and keypad UI is visible and already exists in the DOM
  performance.mark('navigationLoaded');
  performance.mark('visuallyLoaded');

  window.removeEventListener('load', dialerSetup);

  KeypadManager.init();
  // Keypad (app core content) is now bound
  performance.mark('contentInteractive');

  NavbarManager.init();
  // Navbar (chrome) events have now been bound
  performance.mark('navigationInteractive');

  // Tell audio channel manager that we want to adjust the notification
  // channel if the user press the volumeup/volumedown buttons in Dialer.
  if (navigator.mozAudioChannelManager) {
    navigator.mozAudioChannelManager.volumeControlChannel = 'notification';
  }

  setTimeout(function nextTick() {
    var lazyPanels = ['confirmation-message',
                      'edit-mode',
                      'sim-picker'];

    var lazyPanelsElements = lazyPanels.map(function toElement(id) {
      return document.getElementById(id);
    });
    LazyLoader.load(lazyPanelsElements);

    CallHandler.init();
    LazyL10n.get(function loadLazyFilesSet() {
      LazyLoader.load([
        '/shared/js/fb/fb_request.js',
        '/shared/js/fb/fb_data_reader.js',
        '/shared/js/fb/fb_reader_utils.js',
        '/shared/style/confirm.css',
        '/shared/js/confirm.js',
        '/shared/elements/config.js',
        '/shared/elements/gaia-header/dist/gaia-header.js',
        '/shared/style/edit_mode.css'
      ], function fileSetLoaded() {
        performance.mark('fullyLoaded');
      });
    });
  });
});
