
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