/**
 * Created by davidraleigh on 10/11/15.
 */
/**
 * Created by davidraleigh on 9/30/15.
 */
var ViewModel = function() {
    // These are the initial options
    var self = this;

    self.showPlayTitles = ko.observable(true);
    self.showSelectedPlay = ko.observable(false);
    self.selectedPlayTitle = ko.observable("No Selected Play");
    self.plays = ko.observableArray();
    $.getJSON('/bard/play/titles', function(playTitleArray) {
        for (var i = 0; i < playTitleArray.length; i++)
            self.plays.push({"playTitle": playTitleArray[i]});
    });

    self.removePlay = function() {
        self.selectedPlayTitle(this.playTitle);
        //self.plays.remove(this);
        self.showPlayTitles(false);
        self.showSelectedPlay(true);
    }

};
