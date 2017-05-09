const electron = require('electron');
const {app, BrowserWindow} = electron;
var path = require('path');
let win;


app.on('ready', function() {
  win = new BrowserWindow({
    minWidth : 800,
    minHeight: 600,
    show:false,
    //fullscreen: true,
    autoHideMenuBar: true
  });

  // Change this to point to the localhost!
  win.loadURL('http://localhost:3000');
  win.focus();

  win.once('ready-to-show', () => {
    win.show();
    win.maximize();
  })
  win.on('closed', () => { win = null });
  // win.webContents.openDevTools()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

var application = require('./app');
var debug = require('debug')('uTimer:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
application.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(application);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
