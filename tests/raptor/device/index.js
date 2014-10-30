var shell = require('shelljs');

var Device = {

  reboot: function(done) {
    shell.exec('adb reboot && adb wait-for-device', {
      async: true,
      silent: true
    }, function(err) {
      done(err);
    });
  }

};

module.exports = Device;