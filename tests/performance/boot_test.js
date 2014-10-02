'use strict';

var debug = require('debug')('boot');
var Marionette = require('marionette-client');
var PerformanceHelper = requireGaia('/tests/performance/performance_helper');
var App = requireGaia('/tests/performance/app');
var fs = require('fs');
var perfUtils = require('./perf-utils');
var exec = require('./exec-sync');
var appPath = config.appPath;

// This test can currently only be run on actual devices
if (!perfUtils.isDeviceHost()) {
  return;
}

// Reboot the device, and wait for adb to become available
// blocking call until adb service starts
var reboot = function() {
  exec('adb reboot');
  exec('adb wait-for-device');
};

// Grab uptime and realtime values to act as reference to judge the boot time
// This function returns a timestamp representing calculated time of boot
var getEpochStart = function() {
  var utime = parseFloat(exec('adb shell cat /proc/uptime').split(' ')[0]);
  var rtime = parseFloat(exec("adb shell echo '$EPOCHREALTIME'"));

  return (rtime - utime) * 1000;
};

marionette('System >', function() {

  var client = marionette.client({
    settings: {
      'ftu.manifestURL': null,
      'lockscreen.enabled': false
    }
  });
  var helper = new PerformanceHelper({
    lastEvent: 'moz-system-ready',
    app: new App(client, 'system')
  });

  // Do nothing on script timeout. Bug 987383
  client.onScriptTimeout = null;

  setup(function () {
    this.timeout(config.timeout);
    client.setScriptTimeout(config.scriptTimeout);
  });

  test('Boot >', function () {
    helper.repeat(function () {
      // deleteSession -> disconnect -> reboot -> connect -> startSession
      var driver = client.driver;
      var port = driver.port;

      debug('Rebooting device');
      reboot();

      debug('Deleting client session');
      client.deleteSession();

      debug('Disconnecting driver');
      driver.close();

      debug('Creating new driver');
      driver = new Marionette.Drivers.TcpSync({
        port: port,
        connectionTimeout: config.timeout
      });

      debug('Connecting driver');
      driver.connect(function (err) {
        if (err) {
          throw err;
        }

        debug('Resetting client to new driver');
        client.resetWithDriver(driver);

        client.startSession(function () {
          client.switchToFrame();
          PerformanceHelper.injectHelperAtom(client);

          helper.waitForPerfEvent(function(results, error) {
            if (error) {
              throw error;
            }

            var start = getEpochStart();
            var end = PerformanceHelper.getEpochEnd(client);
            var delta = end - start;

            // Bug 1045076: Sanity check. If for some reason any handlers
            // didn't register or we didn't get valid timestamps back, do not
            // report the values for this run and continue on
            if (!end || !start || delta <= 0) {
              return;
            }

            helper.reportRunDurations(results, null, delta);
            helper.finish();
          });

        });
      });

    });
  });
});
