//importing the dotenv npm and other fun lovin' requires for the Liri app
require('dotenv').config();
var request = require("request");
var fs = require("fs");
var keys = require("./keys");
var Spotify = require("node-spotify-api");


var nodeArgs = process.argv;
var action = process.argv[2];

switch (action) {
    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        random();
        break;

    case "spotify-this":
        spotifysearch();

    default:
        console.log("Give LIRI a command. Any command will work.");
}

function getExtraArguments() {
    return nodeArgs.slice(3).join("+");
}

//here's the OMDB function
function movie(movieName) {
    if (!movieName) {
        movieName = getExtraArguments();
    }
    if (!movieName) {
        movieName = "Mr. Nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            console.log("* " + data.Title);
            console.log("* " + data.Year);
            console.log("* " + data.Ratings[0].Value);
            if (data.Ratings[1]) {
                console.log("* " + data.Ratings[1].Value);
            }
            console.log("* " + data.Country);
            console.log("* " + data.Plot);
            console.log("* " + data.Actors);
        }
    });
}

//DJ, play that Spotify function
function spotifysearch(arg) {
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    songName = arg ? arg : "";

    if (songName === "") {
        songName = getExtraArguments();
    }

//for all of the blank inputs, this one is for you
if (!process.argv[3] && songName === "") {
    songName ="Ace of Base The Sign";
}

spotify.search({
    type: "track",
    query: songName,

}, function (err, data) {
    if (err) {
        return console.log("Error occured, dummy: " + err);
    }
    var data = data.tracks.items[0];
    console.log(data.name);
    console.log(data.artists[0].name);
    console.log(data.album.name);
    console.log(data.preview_url);
});
}

//this function is for reading txt

function random() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        var output = data.split(",");
        if (output[0] === "spotify-this-song") {
            spotifysearch(output[1]);
        } else if (output[0] === "movie-this") {
            movie(output[1]);
        } else {
            console.log("this ish isn't vald, try again");
        }
    });
}