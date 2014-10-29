var EventEmitter = require('events').EventEmitter;
var util = require('util');
var child = require('child_process');
var shell = require('shelljs');
var logcat = require('adbkit-logcat');

var Dispatcher = function() {
  EventEmitter.call(this);
};

util.inherits(Dispatcher, EventEmitter);

Dispatcher.prototype._init = function() {
  var dispatcher = this;

  this.adb = child.spawn('adb', ['logcat', '-B']);
  this.parser = logcat.readStream(this.adb.stdout);

  process.on('exit', this.adb.kill);
  this.parser.on('entry', function(entry) {
    dispatcher.emit('entry', entry)
  });
};

Dispatcher.prototype.clearLog = function() {
  shell.exec('adb logcat -c', { async: false, silent: true });
};

Dispatcher.prototype.start = function() {
  this.clearLog();
  this._init();

  return this;
};

Dispatcher.prototype.end = function() {
  this.adb.kill('SIGINT');
  this.parser.removeAllListeners();
};

module.exports = Dispatcher;