/**
 * Created by davidraleigh on 5/28/15.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var qsEx = require('../lib/queryStringLib.js')
var url = require('url');


var mongoURL = 'mongodb://davidraleigh:ticANTiNGESulOM@ds055642-a0.mongolab.com:55642,ds055642-a1.mongolab.com:55642/bard-db?replicaSet=rs-ds055642';
//var mongoURL = 'mongodb://localhost:27017/bard';

/* GET all shakespeare play titles listing. */
router.get('/play/titles', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    fetchPlayTitles(function(playTitles, err) {
        if (err || playTitles === null) {
            //TODO return error
        }
        res.send(JSON.stringify(playTitles));
        next();
    })
});

var fetchPlayTitles = function(callback) {
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        var collection = db.collection('playOverview');
        collection.find({}, {'playTitle':true, '_id':false}).toArray(function(err, doc) {
            if (err || doc === null) {
                callback(null, err);
            }
            var arrayOfTitles = doc.map(function(item) {
                return item.playTitle;
            });
            callback(arrayOfTitles, null);
        });
    });
};

router.get('/play/locations', function(req, res, next) {
    // get the filter from the url.
    var result = url.parse(req.url, true);
    // TODO handle the case where an incorrect formated url is passed.
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        res.setHeader('Content-Type', 'application/json');
        var collection = db.collection('playOverview');
        collection.findOne(result.query, {fields:{'locations':true, '_id':false}}, function(err, doc) {
            if (err || doc === null) {
                // TODO return error
            }
            res.send(JSON.stringify(doc));
        });
    });
});

//All's%20Well%20That%20Ends%20Well
router.get('/play/characters', function(req, res, next) {
    // get the filter from the url.
    var result = url.parse(req.url, true);
    // TODO handle the case where an incorrect formated url is passed.
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        res.setHeader('Content-Type', 'application/json');
        var collection = db.collection('playOverview');
        collection.findOne(result.query, {fields:{'characters':true, '_id':false}}, function(err, doc) {
            if (err || doc === null) {
                // TODO return error
            }
            res.send(JSON.stringify(doc));
        });
    });
});


function draw(collection, query, callback, breakoutCount) {
    breakoutCount = breakoutCount || 0;

    if (breakoutCount === 4) {
        callback({err: "error"})
        return;
    }
    var query = query || { };
    query['random'] = { $lte: Math.random() };

    //TODO maybe this sort is super inefficient
    //http://stackoverflow.com/questions/2824157/random-record-from-mongodb
    collection.find(query).sort({random: -1}).batchSize(1).toArray(function(err, doc) {
        if (err) {
            callback(err);
        } else if (doc.length === 0) {
            // test length without random
            delete query['random'];
            collection.count(query, function(err, count) {
                if (count === 0)
                    callback({err:'error, count === 0'});
                else
                    draw(collection, query, callback, breakoutCount + 1);
            });
        } else {
            doc[0].random = Math.random();
            // give a new random number to increase randomness?
            callback({}, doc[0]);
            collection.update({ _id: doc[0]._id }, doc[0], function(err, result) {
                if (err)
                    console.log("failed to update randomness" + err);
                else
                    console.log("succeeded to update randomness");
            });
        }
    });
};

var quoteCollections = ['sentences', 'endStopped', 'phrases'];



router.get('/play/quote', function(req, res, next) {
    // get the filter from the url.
    var result = url.parse(req.url, false);
    var queryObj = qsEx.parse(result.query);

    var quoteCollection = quoteCollections[Math.floor(Math.random()*quoteCollections.length)];
    // TODO handle the case where an incorrect formated url is passed.
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        res.setHeader('Content-Type', 'application/json');
        var collection = db.collection(quoteCollection);
        draw(collection, queryObj, function(err, result) {
            if (result === null) {
                console.log("Argh!!! /play/quote error");
                console.log(err);
                // TODO return error
            }
            res.send(JSON.stringify(result));
        });
    });
});

module.exports = router;
module.exports.fetchPlayTitles = fetchPlayTitles;


