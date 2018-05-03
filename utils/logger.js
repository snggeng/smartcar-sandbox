const fs      = require('fs')
const path    = require('path')
const through = require('through')
const spawn   = require('child_process').spawn
const bunyan  = require('bunyan')

const prettyStream = function(args) {
  args = args || ['-o', 'short'];
  var bin = path.resolve(path.dirname(require.resolve('bunyan')), '..', 'bin', 'bunyan');
  var stream = through(function write(data) {
    this.queue(data);
  }, function end () {
    this.queue(null);
  });

  if(bin && fs.existsSync(bin)) {
    var formatter = spawn(bin, ['-o', 'short'], {
      stdio: [null, process.stdout, process.stderr]
    });
    stream.pipe(formatter.stdin);
  }

  return stream;
};

const log = bunyan.createLogger({
  name: 'app',
  serializers: bunyan.stdSerializers,
  stream: process.stdout.isTTY ? prettyStream() : process.stdout,
  level: 'info'
})

module.exports = { log, prettyStream }
