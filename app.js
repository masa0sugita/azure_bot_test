// app.js 
let express = require('express');
let Twitter = require('twitter');
let CronJob = require("cron").CronJob;

let app = express();

let twitter = new Twitter({
    consumer_key: '*',
    consumer_secret: '*',
    access_token_key: '*',
    access_token_secret: '*'
});

let cronTime = '0 * * * * *';
new CronJob({
    cronTime: cronTime,
    onTick: function () {
        cycleTweet()
    },
    start: true
});

let tipsArray = [
    "にゃー",
    "わんわん",
    "おっぱい",
];

function cycleTweet() {
    let tips = tipsArray[Math.floor(Math.random() * tipsArray.length)];

    // 自動投稿 
    twitter.post('statuses/update', {status: tips}, (err, tweet, response) => {
        if (err) {
            return console.log(err);
        } else {
            return console.log(tweet);
        }
    });
}
app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    res.send('Hello World')
});

app.listen(app.get('port'), function() {
    console.log("Node app is runnning at localhost:" + app.get('port'))
});


