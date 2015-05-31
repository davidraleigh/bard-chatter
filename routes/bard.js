/**
 * Created by davidraleigh on 5/28/15.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = require('url');

var mongoURL = 'mongodb://localhost:27017/bard';

/* GET all shakespeare play titles listing. */
router.get('/play/titles', function(req, res, next) {
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        res.setHeader('Content-Type', 'application/json');
        var collection = db.collection('playOverview');
        collection.find({}, {'playTitle':true, '_id':false}).toArray(function(err, doc) {
            if (err || doc === null) {
                // TODO return error
            }
            var arrayOfTitles = doc.map(function(item) {
               return item.playTitle;
            });
            res.send(JSON.stringify(arrayOfTitles));
        });
    });
});

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
    collection.find(query).sort({random: -1}).batchSize(1).toArray(function(err, doc) {
        if (err) {
            callback(err);
        } else if (doc.length === 0) {
            // test length without random
            delete query['random'];
            collection.count(query, function(err, result) {
                if (result === 0)
                    callback({err:'error'});
                else
                    draw(collection, query, callback, breakoutCount + 1);
            });
        } else {
            doc[0].random = Math.random();
            // give a new random number to increase randomness?
            collection.update({ _id: doc[0]._id }, doc[0], function(err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback({}, doc[0]);
                }
            });
        }
    });
};

var quoteCollections = ['sentences', 'endStopped', 'phrases'];

router.get('/play/quote', function(req, res, next) {
    // get the filter from the url.
    var result = url.parse(req.url, true);
    var quoteCollection = quoteCollections[Math.floor(Math.random()*quoteCollections.length)];
    // TODO handle the case where an incorrect formated url is passed.
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        res.setHeader('Content-Type', 'application/json');
        var collection = db.collection(quoteCollection);
        draw(collection, result.query, function(err, result) {
            if (err || result === null) {
                // TODO return error
            }
            res.send(JSON.stringify(result));
        });
    });
});

module.exports = router;


