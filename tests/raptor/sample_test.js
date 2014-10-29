var Test = require('./test');

var suite = Test({
  phase: 'cold',
  name: 'Cold Launch | Settings'
});

suite.on('ready', function() {
  console.log('READY');

  suite.on('performanceentry', function(entry) {
    console.log(entry);

    if (entry.entryType === 'fullyLoaded') {
      suite.end();
    }
  });

});