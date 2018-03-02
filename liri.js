
require("dotenv").config();
var keys = require('./keys.js');
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require('fs');




var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var nodeArgv = process.argv;
var command = process.argv[2];

//movie or song
var input = "";

for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        input = input + "+" + nodeArgv[i];
    } else {
        input = input + nodeArgv[i];
    }
}


switch (command) {
    case "my-tweets":
        showTweets();
        break;

    case "spotify-this-song":
        if (input) {
            spotifySong(input);
        } else {
            spotifySong("Starboy");
        }
        break;

    case "movie-this":
        if(input) {
            omdbData(input)
        } else {
            omdbData("Back to the future")
        }
        break;

    default:
        console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this}");
        break;
}

//TWITTER
function showTweets() {
var params = { screen_name: 'JakeBoldbaatar' };
client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            console.log("\n===== Twitter text number: " + i + " =====");
            console.log("' " + tweets[i].text + " '");
            console.log("  Created at: " + tweets[i].created_at.substring(0,19) + "\n");

            fs.writeFile("log.txt", "' " + tweets[i].text + " '")
            fs.writeFile("log.txt", "  Created at: " + tweets[i].created_at.substring(0,19) + "\n")
        }
    } else {
        console.log("Error occurred");
    }
});
}

//SPOTIFY
function spotifySong(input) {
    spotify.search({ type: 'track', query: input, limit: 20 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < data.tracks.items.length; i++) {
            console.log("\n==================\nArtist: " + data.tracks.items[i].artists[0].name);
            console.log("Song: " + data.tracks.items[i].name);
            console.log("Preview URL: " + data.tracks.items[i].preview_url);
            console.log("Album: " + data.tracks.items[i].album.name + "\n");

        }
    })
}

//OMDB

function omdbData (movie){
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&apikey=trilogy';

    request(omdbURL, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("\nTitle: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors + "\n");
        }
    })

}