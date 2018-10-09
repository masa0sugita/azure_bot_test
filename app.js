// app.js 
var express = require('express');
var Twitter = require('twitter');
var CronJob = require("cron").CronJob;

var app = express();

var twitter = new Twitter({
    consumer_key: 'rsZ80FOsOWmexeum9U8T5e92o',
    consumer_secret: 'ZdRfoSwDlOq5I86XWNANeT6rA2Px41CqYjdDtLvltXEv8MMOdf',
    access_token_key: '116741549-vNKcEQ41CFu7wE3PnAIWcnWJPZIwtw2YB04eMiq6',
    access_token_secret: 'VAihSKde78bQHuW59g264c1h0C4S8yrae00uAVQXDJEhW'
});

var cronTime = '0 * * * * *';
new CronJob({
    cronTime: cronTime,
    onTick: function () {
        cycleTweet()
    },
    start: true
});


function cycleTweet() {
    let tips = 'ちょっと投稿テストです。';

    // 自動投稿 
    twitter.post('statuses/update', {status: tips}, (err, tweet, response) => {
        if (err) {
            return console.log(err);
        } else {
            return console.log(tweet);
        }
    });
}
