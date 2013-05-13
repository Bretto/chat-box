

exports.index = function(req, res){
    a + b;  //Throw an error!
  res.render('index', { title: 'Chat Box' });
};

exports.getAnnonce = function (req, res){
    var annonces = [
            {uId:1, aId:1, title:'New computer'},
            {uId:1, aId:2, title:'Nissan Navara'}
        ];
    res.send(annonces);
}

