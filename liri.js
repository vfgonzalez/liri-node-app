require("dotenv").config();
var keys = require('./keys.js')
// // console.log(process.env.SPOTIFY_ID)
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input = process.argv[2]


// var request = require('request')
// // OMDBAPI - http://www.www.omdbapi.com/?apikey=trilogy&t="#flexbile"
// request('http://www.omdbapi.com/?apikey=trilogy&t='+titlevariable, function(error, response, data){
//     if(error){ console.log(error)}
//     console.log(JSON.parse(data.title))
// })


switch(input){
    case 'my-tweets':
        console.log(twitter);
    break;
    case 'spotify-this-song'+process.argv[3]:
        console.log(spotify);
    break;
    case 'movie-this':
        console.log(request);
    break;
    case 'do-what-it-says':
        console.log("I'm Feeling Lucky");
    break;
    default:
        console.log("must make a choice!")

}