define(function(require, exports) {
'use strict';

// Helper for the performance testing events. we created
// this dedicated module since we need some "state machine" logic to avoid
// race conditions and the app contains way too many async operations during
// startup and no simple way to listen to these events.

exports._isMonthsDayInteractive = false;
exports._isMonthReady = false;
exports._isVisuallyActive = false;
exports._isPendingReady = false;

/**
 * Dispatch 'navigationLoaded' marker.
 * Designates that the app's *core* chrome or navigation interface
 * exists in the DOM and is marked as ready to be displayed.
 */
exports.domLoaded = function() {
  // PERFORMANCE EVENT (1): navigationLoaded
  performance.mark('navigationLoaded');
};

/**
 * Designates that the app's *core* chrome or navigation interface
 * has its events bound and is ready for user interaction.
 */
exports.chromeInteractive = function() {
  // PERFORMANCE EVENT (2): navigationInteractive
  performance.mark('navigationInteractive');
};

/**
 * Should be called when the MonthsDayView
 * rendered all the busytimes for that day.
 */
exports.monthsDayReady = function() {
  if (exports._isMonthsDayInteractive) {
    return;
  }

  exports._isMonthsDayInteractive = true;
  dispatchVisuallyCompleteAndInteractive();
};

/**
 * Should be called when the month is "ready" (rendered + event listeners)
 * including the busy times indicator.
 */
exports.monthReady = function() {
  if (exports._isMonthReady) {
    return;
  }

  exports._isMonthReady = true;
  dispatchVisuallyCompleteAndInteractive();
};

/**
 * app-visually-complete and content-interactive will happen after the
 * MonthChild#activate + rendering the busy counts for the current month +
 * DayBased#_loadRecords (inherited by MonthsDayView)
 */
function dispatchVisuallyCompleteAndInteractive() {
  if (exports._isVisuallyActive ||
      !exports._isMonthsDayInteractive ||
      !exports._isMonthReady) {
    return;
  }

  exports._isVisuallyActive = true;

  // PERFORMANCE EVENT (3): visuallyLoaded
  // Designates that the app is visually loaded (e.g.: all of the
  // "above-the-fold" content exists in the DOM and is marked as
  // ready to be displayed).
  performance.mark('visuallyLoaded');

  // PERFORMANCE EVENT (4): contentInteractive
  // Designates that the app has its events bound for the minimum
  // set of functionality to allow the user to interact with the
  // "above-the-fold" content.
  performance.mark('contentInteractive');

  dispatchAppLoad();
}

/**
 * Register that pending manager completed first batch of operations.
 */
exports.pendingReady = function() {
  if (exports._isPendingReady) {
    return;
  }

  exports._isPendingReady = true;
  dispatchAppLoad();
};

/**
 * App is only considered "loaded" after the MonthView and MonthsDayView
 * are "ready" and the first pending operations batch is completed (loading
 * events from DB and recurring events expansion).
 */
function dispatchAppLoad() {
  if (!exports._isVisuallyActive || !exports._isPendingReady) {
    // to avoid race conditions (in case this is called before month view
    // is built), should not happen, but maybe in the future when IDB gets
    // faster this might be possible.
    return;
  }

  // PERFORMANCE EVENT (5): fullyLoaded
  // Designates that the app is *completely* loaded and all relevant
  // "below-the-fold" content exists in the DOM, is marked visible,
  // has its events bound and is ready for user interaction. All
  // required startup background processing should be complete.
  performance.mark('fullyLoaded');
}

});
