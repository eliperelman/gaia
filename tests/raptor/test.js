var tests = {
  'cold': './phases/cold_launch'
};

var Test = function(options) {
  var Runner = require(tests[options.phase]);

  return new Runner(options);
};

module.exports = Test;