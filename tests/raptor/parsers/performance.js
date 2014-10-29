var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher');
var util = require('util');

//console.log('Performance Entry: %s|%s|%d|%d|%s',
//  obj.entryType, obj.name, obj.startTime, obj.duration, obj.epoch || '-');

var tokenMatch = 'Performance Entry: ';

var Parser = function() {
  var parser = this;

  EventEmitter.call(this);

  this.dispatcher = new Dispatcher();
  this.dispatcher.on('entry', function(entry) {
    if (entry.message.indexOf(tokenMatch) !== -1) {
      parser.emit('performanceentry', parser.parse(entry.message));
    }
  });
  this.dispatcher.start();
};

util.inherits(Parser, EventEmitter);

Parser.prototype.parse = function(message) {
  var parts = message
    .replace(tokenMatch, '')
    .split('|');

  var entry = {
    entryType: parts[0],
    name: parts[1],
    startTime: parseFloat(parts[2]),
    duration: parseFloat(parts[3]),
    epoch: parseFloat(parts[4])
  };

  var contextIndex = entry.name.indexOf('@');

  if (contextIndex === -1) {
    return entry;
  }

  var name = entry.name.split('@');

  entry.name = name[0];
  entry.context = name[1];

  return entry;
};

Parser.prototype.end = function() {
  this.dispatcher.end();
  this.removeAllListeners();
};

module.exports = Parser;