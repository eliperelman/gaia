/* globals performance */

'use strict';

/**
 * Utility class to fire events needed to measure the performance
 * of the application.
 * For an explanation of what means each event go here:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=996038
 * For an explanation of how are adapted to the specific needs
 * in the contacts app please go here:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1015388#c8
 */
(function(){

  window.utils = window.utils || {};

  var PerformanceHelper = {
    domLoaded: function() {
      performance.mark('navigationLoaded');
    },
    chromeInteractive: function() {
      performance.mark('navigationInteractive');
    },
    visuallyComplete: function() {
      performance.mark('visuallyLoaded');
    },
    contentInteractive: function() {
      performance.mark('contentInteractive');
    },
    loadEnd: function() {
      performance.mark('fullyLoaded');
    }
  };


  window.utils.PerformanceHelper = PerformanceHelper;

})();
