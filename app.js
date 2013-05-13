
/**
 * Module dependencies.
 */

var express = require('express')
    , app = express()
    , http = require('http')
    , path = require('path')
    , server = http.createServer(app)
    , routes = require('./routes')
    , errorHandler = require('./routes/errorHandler.js')
    , socket = require('./routes/socket.js')
    , io = require('socket.io').listen(server)
    , domain = require('domain');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.use(express.favicon())
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(express.static(path.join(__dirname, 'public')))
    .use(app.router)


app.get('/', routes.index);
app.get('/annonce', routes.getAnnonce);


io.sockets.on('connection', socket);

global.io = io;
global.domain = domain;

app.configure('development', function(){
    app.use(express.errorHandler());
    io.set('log level', 1); // reduce logging
});

app.configure('production', function(){
    app.use(errorHandler());
    io.set('log level', 1); // reduce logging
});

server.listen(app.get('port'));


