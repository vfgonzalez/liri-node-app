/** Welcome to LIRI BOT!
 * This a basic app that pulls data from 3 independent sources through a node based request.
 * requests consist of information from:
 * -Spotify
 * -Twitter
 * -OMDB (IMDB substitute)
 * Each request is limited by a promp using npm inquirer, which creates a list of what action to be completed.
 * There are preset restrictions, and some flexibility. The flexibles include:
 * Spotify: You can either search a song, or leave search blank to return a random song out of 20 choices.
 * Twitter: Set how many tweets you would like to see by Elon Musk! 
 * OMDB: Type in what movie you want to know the details about, or leave blank to see a great movie!
 * (Special) - Click the "I'm feeling lucky" to discover a new song.
 * 
 * Enjoy!!
 */


require("dotenv").config();
var keys = require('./keys.js')
var Spotify = require('node-spotify-api')
var Twitter = require('twitter')
var request = require('request')
var inq = require('inquirer')
var figlet = require('figlet')
var asciify = require('asciify')
// // console.log(process.env.SPOTIFY_ID)
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input = process.argv[2]

// iquirer response stored values
var spotifysong
var movietitle

// standard song search count
var w = 10



// ------------------------------------------------------------------------------

// API CALL with Inquirer prompts functions::::::

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
        message: 'How Many do you want to see?(1-20)'
    }

]
// Welcome function is to load Title of program, then runs prompt.
function welcome(){
    asciify('Liri Bot', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        // prompt caller nested within welcome so figlet initializes first
        promptcaller()
    });
}


// Execution functions for API when called on in inquirer
function twittercall(){
    client.get('statuses/user_timeline', { screen_name: 'elonmusk' }, function (error, tweets, response) {
        if (error) { console.log(error) }
        else {
            for (var i = 0; i < t; i++) {
                console.log(tweets[i].text);
                console.log("------------------------")
            }
        }
    });;
}
// random function pulls a random song titled "I want it that way" when inquirer selection is "I'm feeling lucky"
function random() {
    spotify.search({ type: 'track', query: 'I want it That Way' }, function (err, data) {
        if (err) { return console.log('Error occurred: ' + err); }
        var z = Math.floor(Math.random() * 20)
        console.log("Title: " + data.tracks.items[z].name);
        console.log("By: " + data.tracks.items[z].artists[0].name)
    });
}

function spotifycall() {
    spotify.search({ type: 'track', query: spotifysong }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var l = 0; l < w; l++) {
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

function promptcaller(){
    // initiates inquirer, internal inquirer dependent on selection
    prompt(questions).then(function (r) {
        selection = r
        returnvalue = selection.apiaction
        switch (returnvalue) {
            case 'Search Elon Musk Tweets':
            
            prompt(searchconfirm).then(function (value) {
                t = (value.tweetcount)
                twittercall()
            })
            break;
            case 'Find a Song on Spotify':
            prompt(spotifysearch).then(function (song) {
                if(song.songsearch != ""){
                    spotifysong = song.songsearch
                    spotifycall()
                }else{ 
                    spotifysong = "The Sign Ace of Base"
                    w = 1
                    spotifycall()}
                })
                break;
                case 'Search a Movie':
                prompt(moviesearch).then(function (movie) {
                    if(movie.titlesearch != ""){
                        movietitle = movie.titlesearch.replace(" ", "+")
                        moviecall()
                    }else{
                        movietitle = "Mr.+Nobody."
                        moviecall()
                    }
                })
                break;
                case "I'm Feeling Lucky":
                random()
                break;
            }
        })
    }
    // Initialize welcome screen and prompts
    welcome()