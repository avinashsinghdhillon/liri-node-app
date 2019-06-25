var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var OMDB = require("omdb");
var spotifyKey = new Spotify(keys.spotify);
var omdbKey =  keys.omdb.id;

console.log("This is the process args: " + process.argv[2])

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
            message: "Enter your search words and hit the 'Enter' key:",
            name: "searchWords"
        }
    ])
    .then(function(inquirerResponse){
        var searchWords = inquirerResponse.searchWords.split(" ").join(" ");
        searchToCall(inquirerResponse.searchType, searchWords);
        console.log("Search type: " + inquirerResponse.searchType);
        console.log("Search term: " + inquirerResponse.searchWords);
        console.log("Spotify key: " + keys.spotify.id);
        console.log("OMDB Key: " + omdbKey);
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

}

// spotify-this-song :default "The Sign" by Ace of Base if no song provided
function spotifyNodeApi(searchSong){

}

// movie-this (use Axios)
function omdbApi(searchMovie){

}

// do-what-it-says : spotify-this-song for "I Want it That Way," USE THE "FS" NODE PACKAGE on random.txt
function randomApi(){

}