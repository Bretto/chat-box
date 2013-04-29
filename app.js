
/**
 * Module dependencies.
 */

var express = require('express')
    , app = express()
    , http = require('http')
    , path = require('path')
    , server = http.createServer(app)
    , routes = require('./routes')
    , socket = require('./routes/socket.js')
    , io = require('socket.io').listen(server);



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/messages', routes.getMessages);

io.sockets.on('connection', socket);
global.io = io;

var data = function getData(x,cb){

}



server.listen(app.get('port'));

