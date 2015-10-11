var express = require('express');
var ko = require('knockout/build/output/knockout-latest.debug.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
                            title: 'Express',
                            scripts: [
                                'http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.2.0.js',
                                './javascripts/indexView.js',
                                'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
                                'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js'
                            ]
                        });
});

module.exports = router;
