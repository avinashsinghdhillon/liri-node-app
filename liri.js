var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var spotify = new Spotify(keys.spotify);

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
    });

    function searchToCall (searchTypeSelected){
        switch (searchTypeSelected) {
            case "concert-this":
                bandsInTownApi();
                break;
            case "spotify-this-song": 
                spotifyNodeApi();
                break;
            case "movie-this":
                omdbApi();
                break;
            case "do-what-it-says":
                randomApi();
            default:
                break;
        }
    }

// concert-this
function bandsInTownApi(){

}

// spotify-this-song :default "The Sign" by Ace of Base if no song provided
function spotifyNodeApi(){

}

// movie-this
function omdbApi(){

}

// do-what-it-says : spotify-this-song for "I Want it That Way," USE THE "FS" NODE PACKAGE on random.txt
function randomApi(){

}