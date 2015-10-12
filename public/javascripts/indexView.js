/**
 * Created by davidraleigh on 10/11/15.
 */
/**
 * Created by davidraleigh on 9/30/15.
 */
//var url = require('url');
//var qsEx = require('../../lib/queryStringLib.js');
var serialize = function(obj) {
    var str = [];
    for(var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};

var ViewModel = function() {
    // These are the initial options
    var self = this;

    self.showPlayTitles = ko.observable(true);

    self.showSelectedPlay = ko.observable(false);
    self.showSelectedPlayer = ko.observable(false);

    self.selectedPlayTitle = ko.observable(null);
    self.selectedPlayer = ko.observable(null);
    self.quote = ko.observable("To be or not to be");

    self.plays = ko.observableArray();
    self.players = ko.observableArray();



    self.quoteQueryURL = ko.computed(function() {
        var queryObj = {};
        if (self.selectedPlayTitle() !== null)
            queryObj["playTitle"] = self.selectedPlayTitle();
        if (self.selectedPlayer() !== null)
            queryObj["speaker"] = self.selectedPlayer();
        var queryString = serialize(queryObj);
        var url = '/bard/play/quote';
        if (queryString.length > 0)
            url += "?" + queryString;
        return url;
    }, self).extend({ notify: 'always' });

    self.quoteQueryURL.subscribe(function(quoteURL) {
        $.getJSON(quoteURL, function(quote) {
            self.quote(quote.text);
        });
    });

    //ICount: 1
    //_id: "5599e96232be223e19ddb41b"
    //actNumber: 3
    //characterCount: 46
    //communicationType: "unknown"
    //dialogBlockEnd: "3.4.30"
    //dialogBlockStart: "3.4.30"
    //heCount: 0
    //locations: Array[0]
    //otherNouns: Array[1]
    //people: Array[0]
    //playTitle: "Romeo and Juliet"
    //random: 0.7534593883901834
    //sceneNumber: 4
    //sentimentComparative: 0
    //sentimentNegativeWords: Array[0]
    //sentimentPositiveWords: Array[0]
    //sentimentScore: 0
    //sheCount: 0
    //speaker: "Paris"
    //text: "My lord, I would that Thursday were to-morrow."
    //textType: "sentenceType"
    //theyCount: 0
    //weCount: 0
    //wordCount: 9
    //youCount: 0

    $.getJSON('/bard/play/titles', function(playTitleArray) {
        for (var i = 0; i < playTitleArray.length; i++)
            self.plays.push({"playTitle": playTitleArray[i]});
    });

    var getPlayers = function(playTitleObj) {
        var queryString = serialize(playTitleObj);
        var url = '/bard/play/characters?' + queryString;
        $.getJSON(url, function(charactersObj) {
            for (var i = 0; i < charactersObj.characters.length; i++)
                self.players.push({"character": charactersObj.characters[i]});
        });
    }
    //$.getJSON('/bard/play/quote?playTitle=The%20Tragedy%20of%20Macbeth')



    self.selectPlayer = function() {
        self.selectedPlayer(this.character);
        self.showSelectedPlayer(true);
    };

    self.selectPlay = function() {
        // select the play
        self.selectedPlayTitle(this.playTitle);
        self.showPlayTitles(false);
        self.showSelectedPlay(true);

        // create url for character names
        getPlayers(this);
    };

    self.removePlay = function() {
        self.showPlayTitles(true);
        self.showSelectedPlay(false);
        self.selectedPlayTitle(null);
        self.players([]);
        self.showSelectedPlayer(false);
        self.selectedPlayer(null);

    };

    self.removePlayer = function() {
        self.showSelectedPlayer(false);
        self.selectedPlayer(null);
    };
};
