var Base = require('./runner');

var noop = function() {};

var Test = function(options) {
  var runner = new Runner(options);

  return runner;
};

module.exports = Test;

var suite = Raptor.Test({
  name: 'app launch',
  runs: 30,
  type: 'cold',
  origin: 'app://settings.gaiamobile.org'
});

suite(function(done) {

  suite.test('')

});