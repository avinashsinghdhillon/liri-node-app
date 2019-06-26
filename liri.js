var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var axios = require("axios");
var OMDB = require("omdb");
var moment = require("moment")
var fs = require("fs");
//the API keys for Spotify and OMDB are retrieved from the .env file
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var omdbKey =  keys.omdb.id;

inquirer
    .prompt([
        //give the user the option to select one of the 4 choices
        {
            type: "list",
            message: "What do you want to do? Select one of the following:",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "searchType",
            default: "do-what-it-says"
        },
        //promt the user to enter their search words
        {
            type: "input",
            message: "Enter search words (leave blank for 'do-what-it-says'):",
            name: "searchWords"
        }
    ])
    .then(function(inquirerResponse){
        var searchWords = inquirerResponse.searchWords.split(" ").join(" ");
        searchToCall(inquirerResponse.searchType, searchWords);
    });

    //based on the search type this function calls the appropriate function/API and passes it the search terms.
    function searchToCall (searchTypeSelected, searchTerm){
        switch (searchTypeSelected) {
            case "concert-this":
                bandsInTownApi(searchTerm);
                break;
            case "spotify-this-song": 
                spotifyNodeApi(searchTerm);
                break;
            case "movie-this":
                omdbApi(searchTerm);
                break;
            case "do-what-it-says":
                randomApi();
            default:
                break;
        }
    }

// concert-this (use Axios)
function bandsInTownApi(searchBand){
    if(searchBand === ""){
        searchBand = "Three Days Grace";
    }
    axios.get("https://rest.bandsintown.com/artists/" + searchBand + "/events?app_id=codingbootcamp").then(
        function(response) {
            console.log(response.data[0]);
            console.log(response.data.length);
            if(response.data.length > 0){
                for(let i = 0; i < response.data.length; i++){
                    console.log("--------------------------------");
                    console.log("Venue: " + response.data[i].venue.name);
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                    console.log("Event Date and Time: " + moment.utc(response.data[i].datetime).toDate());
                    console.log("--------------------------------");
                }
                console.log(response.data.length + " events listed above.");
            }
        })
        .catch(function(error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
}

// spotify-this-song :default "The Sign" by Ace of Base if no song provided
function spotifyNodeApi(searchSong){
    if(searchSong === ""){
        searchSong = "The Sign";
    }
    spotify.search({ type: 'track', query: searchSong , order: "popularity"}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        if(data.tracks.items.length > 0){
          for (var i = 0; i < data.tracks.items.length; i++){
            debugger;
            console.log("--------------------------------");
            console.log("Artist: " + data.tracks.items[i].artists[0].name);
            console.log("Song's Name: " + data.tracks.items[i].name);
            console.log("Preview: " + data.tracks.items[i].external_urls.spotify);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("Popularity: " + data.tracks.items[i].popularity);
            console.log("--------------------------------");
          }
          console.log(data.tracks.items.length + " songs matched your search.");
        }
      });
}

// movie-this (use Axios)
function omdbApi(searchMovie){
    if(searchMovie === ""){
        searchMovie = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&apikey=" + omdbKey).then(
        function(response) {
            console.log("--------------------------------");
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data["Ratings"][1]["Value"]);
            console.log("Production Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("--------------------------------");
        })
        .catch(function(error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
}

// do-what-it-says : spotify-this-song for "I Want it That Way," USE THE "FS" NODE PACKAGE on random.txt
function randomApi(){
    fs.readFile("random.txt", "utf8", function(error, data) {
    
      if (error) {
        return console.log(error);
      }
      //create an array out of the text in the random.txt file
      var dataArr = data.split(",");

      if(dataArr.length > 0){
        searchToCall(dataArr[0], dataArr[1]);
      }
    
    });
}