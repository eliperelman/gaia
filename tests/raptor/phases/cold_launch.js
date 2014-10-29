var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Parser = require('../parsers/performance');

var ColdLaunch = function(options) {
  var runner = this;

  EventEmitter.call(this);
  this.entries = [];
  this.options = options;

  process.nextTick(function() {
    var parser = runner.parser = new Parser();

    parser.on('performanceentry', function(entry) {
      entries.push(entry);
      runner.emit('performanceentry', entry);
    });

    runner.emit('ready');
  });
};

util.inherits(ColdLaunch, EventEmitter);

ColdLaunch.prototype.end = function() {
  this.removeAllListeners();
};

module.exports = ColdLaunch;