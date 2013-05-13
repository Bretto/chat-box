
exports = module.exports = function errorHandler(){
    return function errorHandler(err, req, res, next){
        console.error('Error [EXPRESS]:', err);
        res.end();
    };
};