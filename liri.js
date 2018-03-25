require("dotenv").config();
var keys = require('./keys.js')
var Spotify = require('node-spotify-api')
var Twitter = require('twitter')
var request = require('request')
var inq = require('inquirer')
// // console.log(process.env.SPOTIFY_ID)
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input = process.argv[2]

// iquirer response stored values
var spotifysong
var movietitle

// basic working function when typing argument in terminal - WORKS
// switch(input){
//     case 'my-tweets':
//     client.get('statuses/user_timeline', {screen_name: 'elonmusk'}, function(error, tweets, response) {
//         for(var i=0; i<10;i++){
//         console.log(tweets[i].text);
//     }
//      });;
//     break;
//     case 'spotify-this-song' :
//     spotify.search({ type: 'track', query: 'Psycho' }, function(err, data) {
//         if (err) {
//           return console.log('Error occurred: ' + err);
//         }

//       console.log(data); 
//       });
//     break;
//     case 'movie-this':
//     request('http://www.omdbapi.com/?apikey=trilogy&t=avatar', function(error, response, data){
//         if(error){ console.log(error)}
//         console.log((data))
//     })
//     break;
//     case 'do-what-it-says':
//         console.log("I'm Feeling Lucky");
//     break;
//     default:
//         console.log("must make a choice!")

// }


// ------------------------------------------------------------------------------

// Trial CODE BELOW:::::

var prompt = inq.createPromptModule()

var selection

var returnvalue

var t

// Inquirer question arrays below
var questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'apiaction',
        choices: [
            {
                name: 'Search Elon Musk Tweets',
                message: 'my-tweets'
            },
            {
                name: 'Find a Song on Spotify',
                message: 'spotify-this-song'
            },
            {
                name: 'Search a Movie',
                message: 'movie-this'
            },
            {
                name: "I'm Feeling Lucky",
                message: 'random'
            }

        ]
    }
]
var spotifysearch = [
    {
        type: 'input',
        name: 'songsearch',
        message: 'What Song do you want to search?'
    }
]
var moviesearch = [
    {
        type: 'input',
        name: 'titlesearch',
        message: 'What Movie do you want to search?'
    }
]
var searchconfirm = [
    {
        type: 'input',
        name: 'tweetcount',
        message: 'How Many do you want to see?(1-30)'
    }

]


// Execution functions for API when called on in inquirer
var twittercall =
    client.get('statuses/user_timeline', { screen_name: 'elonmusk' }, function (error, tweets, response) {
        if (error) { console.log(error) }
        else {
            for (var i = t; i < t; i++) {
                console.log(tweets[i].text);
                console.log("------------------------")
            }
        }
    });;
// random function pulls a random song titled "I want it that way" when inquirer selection is "I'm feeling lucky"
function random() {
    spotify.search({ type: 'track', query: 'I want it That Way' }, function (err, data) {
        if (err) { return console.log('Error occurred: ' + err); }
        var z = Math.floor(Math.random() * 10)
        console.log("Title: " + data.tracks.items[z].name);
        console.log("By: " + data.tracks.items[z].artists[0].name)
    });
}

function spotifycall() {
    spotify.search({ type: 'track', query: spotifysong }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var l = 0; l < 20; l++) {
            console.log("Title: " + data.tracks.items[l].name)
            console.log("By: " + data.tracks.items[l].artists[0].name);
            console.log("------------------------")
        }
    });
}
function moviecall() {
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + movietitle, function (error, response, data) {
        if (error) { console.log(error) }
        console.log(JSON.parse(data))
    })
}

// initiates inquirer, internal inquirer dependent on selection
prompt(questions).then(function (r) {
    selection = r
    returnvalue = selection.apiaction
    switch (returnvalue) {
        case 'Search Elon Musk Tweets':
            prompt(searchconfirm).then(function (value) {
                t = parseInt(value)
                client.get('statuses/user_timeline', { screen_name: 'elonmusk' }, function (error, tweets, response) {
                    if (error) { console.log(error) }
                    for (var i = t; i < t; i++) {
                        console.log(tweets[i].text);
                        console.log("------------------------")
                    }
                });;
            })
            break;
        case 'Find a Song on Spotify':
            prompt(spotifysearch).then(function (song) {
                spotifysong = song.songsearch
                spotifycall()
            })
            break;
        case 'Search a Movie':
            prompt(moviesearch).then(function (movie) {
                movietitle = movie.titlesearch.replace(" ", "+")
                moviecall()
            })
            break;
        case "I'm Feeling Lucky":
            random()
            break;
    }
})

