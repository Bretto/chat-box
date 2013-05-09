
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
//    , moment = require('moment');




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
app.get('/message/:userId', routes.getMessage);
app.get('/annonce', routes.getAnnonce);

//var getMessages = function (req, res){
//    console.log('This is USR MSG');
//    data = {'data':'this is my data 2'};
//    res.send(data);
//    //res.end();
//};
//
//app.get('/messages', getMessages);



io.sockets.on('connection', socket);
global.io = io;


server.listen(app.get('port'));

