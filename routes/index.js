
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

exports.getMessage = function (req, res){
    var userId = req.params.userId;
    console.log('This is USR MSG', userId);

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
    data = {'data':'this is my data', userId:userId};
    res.send(data);
    //res.end();
};

exports.getAnnonce = function (req, res){
    var annonce = [
            {uid:1, aId:1, title:'New computer'},
            {uId:1, aId:2, title:'Nissan Navara'}
        ];
    res.send(annonce);
}

