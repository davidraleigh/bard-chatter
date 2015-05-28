/**
 * Created by davidraleigh on 5/28/15.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var mongoURL = 'mongodb://localhost:27017/bard';

/* GET all shakespeare play titles listing. */
router.get('/playTitles', function(req, res, next) {
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
            if (doc != null) {
                res.send(JSON.stringify(arrayOfTitles));
            } else {
                // TODO error return
            }
        });
    });
});

module.exports = router;


