
var pty = require('pty.js')

exports.create = createTerminal

function createTerminal(program, args, padding) {

  var options = {
        cols: process.stdout.columns,
        rows: process.stdout.rows - padding,
        cwd: process.cwd(),
        env: process.env
      }

  var child = pty.spawn(program, args, options)
    , stdin = process.stdin
    , stdout = process.stdout

  if (stdin.setRawMode) stdin.setRawMode(true)

  stdin.on('data', function(data) {
    child.write(data)
  })

  stdout.on('resize', function() {
    child.resize(stdout.columns, stdout.rows - padding)
    child.emit('resize')
  })

  child.on('end', function(data) {
    if (stdin.setRawMode) stdin.setRawMode(false)
  })

  return child

}
