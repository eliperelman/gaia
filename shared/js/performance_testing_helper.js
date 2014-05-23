'use strict';

(function(window) {

  function dispatch(name) {
    if (!window.mozPerfHasListener) {
      return;
    }

    var now = window.performance.now();

    setTimeout(function() {
      var detail = {
        name: name,
        timestamp: now
      };
      var event = new CustomEvent('x-moz-perf', { detail: detail });

      window.dispatchEvent(event);
    });
  }

  [
    'chrome-dom-loaded',
    'chrome-interactive',
    'app-visually-complete',
    'content-interactive',
    'app-loaded'
  ].forEach(function(eventName) {
      window.addEventListener(eventName, function mozPerfLoadHandler() {
        dispatch(eventName);
      }, false);
    });

  window.PerformanceTestingHelper = {
    dispatch: dispatch
  };

})(window);
