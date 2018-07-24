require("dotenv").config();
var request = require("request");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require('./keys.js');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var toDo = process.argv[2];
var toSearch ='';
for (var i = 3; i < process.argv.length; i++){
    toSearch += (process.argv[i] + ' ');
  }
function chooseAction(toDo) {
  switch(toDo) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifySong();
        break;
    case 'movie-this':
        movieThis();
        break;
    case 'do-what-it-says':
        doThing();
        break;
    default: 
        console.log('Please input one of the following:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says')
        break;
    }
}
function myTweets() { 
    var params = {screen_name: 'MikeyWi37938662'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log('Error occurred: '+error);
        }
    // console.log(tweets);
        for (var i=0;i<2;i++) {
            console.log('On '+tweets[i].created_at+', '+params.screen_name+' tweeted: '+ tweets[i].text);
        }
    
    });
}    
function spotifySong() {
    if(!toSearch){
        toSearch = "The Sign by Ace of Base";
    }
    spotify.search({ type: 'track', query: toSearch, limit: 1 }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
        
        //console.log(data.tracks.items[0]); 
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log('Artist(s): '+data.tracks.items[0].artists[0].name);
        console.log('Spotify Link Preview: ' + data.tracks.items[0].preview_url); 
        console.log('Album Name: ' + data.tracks.items[0].album.name); 
    });
}
function movieThis() {
    if(!toSearch) {
        toSearch='Mr.Nobody';
    }
    request('http://www.omdbapi.com/?t='+toSearch+'&y=&plot=short&apikey=trilogy', function(error, response, body) {

    if (error) {
        return console.log('Error occurred: ' + error);
    // If the request is successful (i.e. if the response status code is 200)
    } else if (!error && response.statusCode === 200) {
        //console.log(JSON.parse(body));
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log(JSON.parse(body).Ratings[1].Source + " Rating: "+ JSON.parse(body).Ratings[1].Value); 
        console.log("Countries Produced in: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
    }
    });
}
function doThing() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log('Error Occurred: ' + error);
          }
        toDo = data.split(",")[0];
        toSearch = data.split(",")[1];

        chooseAction(toDo);
        });
}
chooseAction(toDo);