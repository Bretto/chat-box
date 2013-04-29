
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Chat Box' });
};

exports.partial = function (req, res) {
    var name = req.params.name;
    res.render('partial/' + name);
};

exports.getMessages = function (req, res){
    console.log('This is USR MSG');

//    function fakeResponce(cb){
//        setTimeout(function(){
//            cb('this is my data');
//        },2000);
//    }
//
//    function getData(cb){
//        var data = null;
//        $log.info('getData()');
//        fakeResponce(function(res){
//            data = res;
//            cb(data);
//        });
//    }
//
//    getData(function(data){
//        $log.info(data);
//    });
    data = {'data':'this is my data'};
    res.send(data);
    //res.end();
};