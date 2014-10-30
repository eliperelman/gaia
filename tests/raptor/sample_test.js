var Suite = require('./suite');

var suite = Suite({
  phase: 'reboot',
  name: 'Reboot Device'
});

suite.on('ready', function() {

  suite.on('performanceentry', function(entry) {
    if (entry.name === 'fullyLoaded' && entry.context === 'Homescreen') {
      suite.end();
    }
  });

  suite.on('end', function(entries) {
    console.log(entries);
  });

});