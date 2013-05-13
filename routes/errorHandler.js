var winston = require('winston');

exports = module.exports = function errorHandler(){
    return function errorHandler(err, req, res, next){
        if (err.status) res.statusCode = err.status;
        if (res.statusCode < 400) res.statusCode = 500;
        winston.error(err.stack);
        res.end();
    };
};